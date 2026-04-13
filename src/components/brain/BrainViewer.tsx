import { useRef, useEffect } from 'react';
import '@google/model-viewer';
import type { ModelViewerElement, ModelViewerMaterial, AlphaMode } from '../../types/model-viewer';
import type { BrainStoryStep } from '../../types/brain';
import {
  AREA_CONFIG,
  MATERIAL_TO_AREA,
  RED_BASE,
  RED_EMISSIVE,
  DIM_ALPHA,
} from '../../data/brainStory';

// ─── Snapshot ─────────────────────────────────────────────────────────────────

interface MaterialSnapshot {
  baseColorFactor: [number, number, number, number];
  emissiveFactor: [number, number, number];
  alphaMode: AlphaMode;
}

// ─── Core logic (pure functions, no React deps) ───────────────────────────────

function buildHighlightSet(areas: string[]): Set<string> {
  const set = new Set<string>();
  for (const key of areas) {
    const cfg = AREA_CONFIG[key as keyof typeof AREA_CONFIG];
    if (cfg) cfg.materials.forEach((m) => set.add(m)); // already lowercase
  }
  return set;
}

/**
 * Apply visual state to every material in the scene for the current step.
 *
 * Priority rules per material:
 *  1. allRed      → red base + red emissive, fully opaque
 *  2. highlighted → palette emissive on original base, OPAQUE
 *  3. has highlights but NOT highlighted → semi-transparent "ghost" (BLEND, DIM_ALPHA)
 *  4. no highlights  → restore original snapshot (OPAQUE, original colours)
 *
 * The ghost path is the key mechanism for the lobi_g two-material case:
 * when `corteccia` is active, mat_lobo_frontale (same mesh as mat_lobi) is
 * highlighted while mat_lobi is independently ghosted — they never interfere.
 */
function applyStep(
  materials: ModelViewerMaterial[],
  snapshots: Map<string, MaterialSnapshot>,
  step: BrainStoryStep
): void {
  const highlightSet = buildHighlightSet(step.highlightAreas);
  const hasHighlights = highlightSet.size > 0;

  for (const mat of materials) {
    const key = mat.name.toLowerCase();
    const snap = snapshots.get(key);

    // ── 1. All-red (cortocircuito) ──────────────────────────────────────────
    if (step.allRed) {
      ensureOpaque(mat, snap);
      mat.pbrMetallicRoughness.setBaseColorFactor(RED_BASE);
      mat.setEmissiveFactor(RED_EMISSIVE);
      continue;
    }

    // ── 2. Highlighted ───────────────────────────────────────────────────────
    if (hasHighlights && highlightSet.has(key)) {
      ensureOpaque(mat, snap);

      const areaKey = MATERIAL_TO_AREA.get(key);
      const cfg = areaKey ? AREA_CONFIG[areaKey] : undefined;

      // Restore original base so texture reads naturally, then layer emissive.
      // If the area config provides an explicit baseColor (e.g. ciliegie) use it.
      if (cfg?.baseColor) {
        mat.pbrMetallicRoughness.setBaseColorFactor(cfg.baseColor);
      } else if (snap) {
        mat.pbrMetallicRoughness.setBaseColorFactor(snap.baseColorFactor);
      }

      mat.setEmissiveFactor(cfg?.emissive ?? [0.4, 0.4, 0.0]);
      continue;
    }

    // ── 3. Ghost — same mesh, different material (e.g. mat_lobi vs mat_lobo_frontale)
    //         — or any non-highlighted material when highlights are active ──────
    if (hasHighlights) {
      // Switch to BLEND to honour the alpha channel.
      mat.setAlphaMode('BLEND');

      // Keep the material's own RGB so the geometry reads correctly under
      // the transparency; collapse alpha to create the X-ray effect.
      const [r, g, b] = snap?.baseColorFactor ?? [1, 1, 1, 1];
      mat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, DIM_ALPHA]);
      mat.setEmissiveFactor([0, 0, 0]);
      continue;
    }

    // ── 4. Restore original ──────────────────────────────────────────────────
    if (snap) {
      mat.setAlphaMode(snap.alphaMode);
      mat.pbrMetallicRoughness.setBaseColorFactor(snap.baseColorFactor);
      mat.setEmissiveFactor(snap.emissiveFactor);
    }
  }
}

/**
 * Ensure a material is fully opaque before setting colours.
 * Restores the original alphaMode from the snapshot; falls back to OPAQUE.
 * Called before highlighted and all-red paths to undo any previous BLEND state.
 */
function ensureOpaque(mat: ModelViewerMaterial, snap: MaterialSnapshot | undefined): void {
  const mode = snap?.alphaMode ?? 'OPAQUE';
  if (mat.alphaMode !== mode) mat.setAlphaMode(mode);
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

  // Stable ref so one-time listeners always see latest props without re-attaching.
  const latestRef = useRef({ step, onLoad, onARStatus });
  useEffect(() => {
    latestRef.current = { step, onLoad, onARStatus };
  });

  // ── Load ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      // Give model-viewer time to finalise its material objects after loading.
      setTimeout(() => {
        if (!viewer.model) return;

        // Capture original state for every material before we touch anything.
        snapshotsRef.current.clear();
        for (const mat of viewer.model.materials) {
          snapshotsRef.current.set(mat.name.toLowerCase(), {
            baseColorFactor: [...mat.pbrMetallicRoughness.baseColorFactor] as [number, number, number, number],
            emissiveFactor: [...mat.emissiveFactor] as [number, number, number],
            alphaMode: mat.alphaMode,
          });
        }

        modelLoadedRef.current = true;
        applyStep(viewer.model.materials, snapshotsRef.current, latestRef.current.step);
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

  // ── Animation ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !modelLoadedRef.current) return;
    if (step.playAnimation) {
      viewer.setAttribute('animation-name', 'ciliegie');
      viewer.setAttribute('autoplay', '');
    } else {
      viewer.removeAttribute('autoplay');
      viewer.removeAttribute('animation-name');
    }
  }, [step.playAnimation]);

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
      {/* @ts-ignore — custom element registered via @google/model-viewer import */}
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
        min-camera-orbit="auto auto 1.2m"
        max-camera-orbit="auto auto 4m"
        field-of-view="35deg"
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
            bottom: '1rem',
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
