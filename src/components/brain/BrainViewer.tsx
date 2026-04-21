import { useRef, useEffect } from 'react';
import '@google/model-viewer';
import type { ModelViewerElement, ModelViewerMaterial, AlphaMode } from '../../types/model-viewer';
import type { BrainStoryStep } from '../../types/brain';
import {
  AREA_CONFIG,
  MATERIAL_TO_AREA,
  MATERIAL_TO_CONDITIONAL,
  CONDITIONAL_AREAS,
  BRAIN_PINK,
  RED_BASE,
  RED_EMISSIVE,
  DIM_ALPHA,
} from '../../data/brainStory';

// ─── Snapshot ─────────────────────────────────────────────────────────────────

interface MaterialSnapshot {
  baseColorFactor: [number, number, number, number];
  emissiveFactor: [number, number, number];
  alphaMode: AlphaMode;
  alphaCutoff: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface HighlightSets {
  /** Materials that receive the palette colour + emissive. */
  highlightSet: Set<string>;
  /** Materials in the area that stay at brain-pink with no emissive (not ghosted). */
  neutralSet: Set<string>;
}

function buildHighlightSets(areas: string[]): HighlightSets {
  const highlightSet = new Set<string>();
  const neutralSet = new Set<string>();
  for (const key of areas) {
    const cfg = AREA_CONFIG[key as keyof typeof AREA_CONFIG];
    if (!cfg) continue;
    cfg.materials.forEach((m) => highlightSet.add(m));
    cfg.neutralMaterials?.forEach((m) => {
      highlightSet.add(m); // prevent ghosting
      neutralSet.add(m);   // but keep at snapshot colour
    });
  }
  return { highlightSet, neutralSet };
}

function ensureOpaque(mat: ModelViewerMaterial): void {
  mat.setAlphaMode('OPAQUE');
  mat.setAlphaCutoff(0);
}

// ─── Core render logic ────────────────────────────────────────────────────────
/**
 * Apply visual state to all GLB materials for the current step.
 *
 * Priority per material:
 *  1. Conditional mesh not in its visible step → BLEND, alpha 0 (hidden, no shadow)
 *  2. allRed (and not conditional)             → full-brain red
 *  3a. In highlight set AND in neutral set     → OPAQUE, brain-pink, no emissive
 *  3b. In highlight set (not neutral)          → OPAQUE, palette emissive
 *  4. Has highlights but NOT highlighted       → ghost (BLEND, DIM_ALPHA)
 *  5. No highlights                            → restore snapshot (BRAIN_PINK for tissue)
 *
 * lobi_g mesh — two materials, iterated independently:
 *   • Mat_lobo_frontale → corteccia.materials   → highlighted blue (rule 3b)
 *   • Mat_lobi          → corteccia.neutralMaterials → stays brain-pink (rule 3a)
 */
function applyStep(
  materials: ModelViewerMaterial[],
  snapshots: Map<string, MaterialSnapshot>,
  step: BrainStoryStep
): void {
  const { highlightSet, neutralSet } = buildHighlightSets(step.highlightAreas);
  const hasHighlights = highlightSet.size > 0;

  for (const mat of materials) {
    const key = mat.name.toLowerCase();
    const snap = snapshots.get(key);

    // ── 1. Conditional mesh visibility ──────────────────────────────────────
    const conditionalAreaKey = MATERIAL_TO_CONDITIONAL.get(key);
    if (conditionalAreaKey !== undefined) {
      const visibleSteps = CONDITIONAL_AREAS[conditionalAreaKey] ?? [];
      if (!visibleSteps.includes(step.id)) {
        // Not this mesh's step — hide with BLEND + alpha 0.
        // BLEND is much more effective than MASK in model-viewer to suppress shadows completely.
        mat.setAlphaMode('BLEND');
        mat.setAlphaCutoff(0.0);
        const [r, g, b] = snap?.baseColorFactor ?? [1, 1, 1, 1];
        mat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 0.0]);
        mat.setEmissiveFactor([0, 0, 0]);
        continue;
      }
      // Visible in this step → fall through to highlight logic below.
    }

    // ── 2. All-red (cortocircuito, step 7) ──────────────────────────────────
    if (step.allRed && conditionalAreaKey === undefined) {
      ensureOpaque(mat);
      mat.pbrMetallicRoughness.setBaseColorFactor(RED_BASE);
      mat.setEmissiveFactor(RED_EMISSIVE);
      continue;
    }

    // ── 3. Highlighted (or neutral — in area but keeps brain-pink) ──────────
    if (hasHighlights && highlightSet.has(key)) {
      // 3a. Neutral: shares mesh with a highlighted material but stays at pink.
      if (neutralSet.has(key)) {
        ensureOpaque(mat);
        if (snap) {
          mat.pbrMetallicRoughness.setBaseColorFactor(snap.baseColorFactor);
          mat.setEmissiveFactor([0, 0, 0]);
        }
        continue;
      }

      // 3b. Fully highlighted: palette colour + emissive.
      ensureOpaque(mat);
      const areaKey = MATERIAL_TO_AREA.get(key);
      const cfg = areaKey ? AREA_CONFIG[areaKey] : undefined;

      // Per-material color takes precedence over area-wide baseColor.
      const perMatColor = cfg?.materialColors?.[key];
      if (perMatColor) {
        mat.pbrMetallicRoughness.setBaseColorFactor(perMatColor);
      } else if (cfg?.baseColor) {
        mat.pbrMetallicRoughness.setBaseColorFactor(cfg.baseColor);
        // Se disponibile, riduciamo la riflessione speculare dell'ambiente
        if (typeof (mat.pbrMetallicRoughness as any).setRoughnessFactor === 'function') {
          (mat.pbrMetallicRoughness as any).setRoughnessFactor(0.8);
        }
      } else if (snap) {
        // Keep the snapshot base (brain pink) so texture reads correctly;
        // emissive provides the palette-colour glow on top.
        mat.pbrMetallicRoughness.setBaseColorFactor(snap.baseColorFactor);
      }
      
      // se è definito un perMatColor potremmo voler annullare l'emissive per evitare glowing indesiderati
      // a meno che non si voglia. In questo caso lasciamo emissive 0 se è il gambo della ciliegia per renderlo naturale.
      if (key === 'mat_gambo_ciliegia') {
        mat.setEmissiveFactor([0, 0, 0]);
      } else {
        mat.setEmissiveFactor(cfg?.emissive ?? [0.4, 0.4, 0.0]);
      }
      continue;
    }

    // ── 4. Ghost (non-highlighted when other areas are active) ───────────────
    if (hasHighlights) {
      mat.setAlphaMode('BLEND');
      mat.setAlphaCutoff(0);
      const [r, g, b] = snap?.baseColorFactor ?? [1, 1, 1, 1];
      mat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, DIM_ALPHA]);
      mat.setEmissiveFactor([0, 0, 0]);
      continue;
    }

    // ── 5. Restore to snapshot (brain pink baseline) ─────────────────────────
    if (snap) {
      mat.setAlphaMode(snap.alphaMode);
      mat.setAlphaCutoff(snap.alphaCutoff);
      mat.pbrMetallicRoughness.setBaseColorFactor(snap.baseColorFactor);
      mat.setEmissiveFactor(snap.emissiveFactor);
    }
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

interface BrainViewerProps {
  step: BrainStoryStep;
  onLoad?: () => void;
  onARStatus?: (status: string) => void;
}

export default function BrainViewer({ step, onLoad, onARStatus }: BrainViewerProps) {
  const viewerRef = useRef<ModelViewerElement>(null);
  const modelLoadedRef = useRef(false);
  const snapshotsRef = useRef<Map<string, MaterialSnapshot>>(new Map());

  // Stable ref so one-time listeners always see latest props.
  const latestRef = useRef({ step, onLoad, onARStatus });
  useEffect(() => {
    latestRef.current = { step, onLoad, onARStatus };
  });

  // ── Load ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      setTimeout(() => {
        if (!viewer.model) return;

        const mats = viewer.model.materials;

        // Debug: log all material names so the exact GLB names can be verified.
        // Remove in production.
        console.log('[BrainViewer] materials:', mats.map((m) => m.name));

        // Step A — Apply brain-pink to all non-conditional brain-tissue materials.
        // Conditional meshes (ciliegie, saette) keep their own GLB colours.
        for (const mat of mats) {
          const key = mat.name.toLowerCase();
          if (!MATERIAL_TO_CONDITIONAL.has(key)) {
            mat.pbrMetallicRoughness.setBaseColorFactor(BRAIN_PINK);
            mat.setEmissiveFactor([0, 0, 0]);
            mat.setAlphaMode('OPAQUE');
          }
        }

        // Step B — Hide conditional meshes (they'll only appear in their steps).
        // Hide with BLEND + alpha 0 to ensure both visibility and shadows are suppressed.
        for (const mat of mats) {
          if (MATERIAL_TO_CONDITIONAL.has(mat.name.toLowerCase())) {
            mat.setAlphaMode('BLEND');
            mat.setAlphaCutoff(0.0);
            const [r, g, b] = mat.pbrMetallicRoughness.baseColorFactor;
            mat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 0.0]);
            mat.setEmissiveFactor([0, 0, 0]);
          }
        }

        // Step C — Capture snapshot AFTER pink + hide have been applied.
        // "Restore to normal" will therefore restore to pink, not original GLB white.
        snapshotsRef.current.clear();
        for (const mat of mats) {
          snapshotsRef.current.set(mat.name.toLowerCase(), {
            baseColorFactor: [...mat.pbrMetallicRoughness.baseColorFactor] as [number, number, number, number],
            emissiveFactor: [...mat.emissiveFactor] as [number, number, number],
            alphaMode: mat.alphaMode,
            alphaCutoff: mat.alphaCutoff,
          });
        }

        modelLoadedRef.current = true;
        applyStep(mats, snapshotsRef.current, latestRef.current.step);
        latestRef.current.onLoad?.();
      }, 150);
    };

    viewer.addEventListener('load', handleLoad);
    return () => viewer.removeEventListener('load', handleLoad);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Step change → re-apply materials ─────────────────────────────────────────
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!modelLoadedRef.current || !viewer?.model) return;
    applyStep(viewer.model.materials, snapshotsRef.current, step);
  }, [step]);

  // ── Camera ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.setAttribute('camera-orbit', step.cameraOrbit);
    viewer.setAttribute('camera-target', step.cameraTarget);
  }, [step.cameraOrbit, step.cameraTarget]);

  // ── Animation (step-specific animations: ciliegie, saette) ──────────────────
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !modelLoadedRef.current) return;
    if (step.animationName) {
      viewer.setAttribute('animation-name', step.animationName);
      viewer.play();
    } else {
      viewer.pause();
      viewer.removeAttribute('animation-name');
    }
  }, [step.animationName]);

  // ── AR status ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ status: string }>;
      latestRef.current.onARStatus?.(ev.detail?.status ?? '');
    };
    viewer.addEventListener('ar-status', handler);
    return () => viewer.removeEventListener('ar-status', handler);
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full">
      {/* @ts-ignore — custom element registered by @google/model-viewer import */}
      <model-viewer
        ref={viewerRef}
        src="/models/cervello.glb"
        ios-src="/models/cervello.usdz"
        ar=""
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        camera-controls=""
        touch-action="pan-y"
        interaction-prompt="none"
        shadow-intensity="0.8"
        environment-image="neutral"
        exposure="1.1"
        camera-orbit={step.cameraOrbit}
        camera-target={step.cameraTarget}
        min-camera-orbit="auto auto 1.0m"
        max-camera-orbit="auto auto 3m"
        field-of-view="38deg"
        auto-rotate=""
        auto-rotate-delay="5000"
        loading="eager"
        alt="Modello 3D interattivo del cervello umano"
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <button
          slot="ar-button"
          style={{
            position: 'absolute',
            top: '3rem',
            right: '1rem',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '600',
            padding: '0.625rem 1rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255,255,255,0.28)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          Visualizza in AR
        </button>
      </model-viewer>
    </div>
  );
}
