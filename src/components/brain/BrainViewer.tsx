import { useRef, useEffect, useCallback } from 'react';
import '@google/model-viewer';
import type { ModelViewerElement } from '../../types/model-viewer';
import type { BrainStoryStep } from '../../types/brain';
import {
  AREA_MATERIAL_MAP,
  HIGHLIGHT_COLOR,
  HIGHLIGHT_EMISSIVE,
  RED_COLOR,
  RED_EMISSIVE,
  NORMAL_COLOR,
  NORMAL_EMISSIVE,
} from '../../data/brainStory';

interface BrainViewerProps {
  step: BrainStoryStep;
  onLoad?: () => void;
  onARStatus?: (status: string) => void;
}

export default function BrainViewer({ step, onLoad, onARStatus }: BrainViewerProps) {
  const viewerRef = useRef<ModelViewerElement>(null);
  const modelLoadedRef = useRef(false);

  const getMaterialsToHighlight = useCallback((areas: string[]) => {
    const names = new Set<string>();
    areas.forEach((area) => {
      const matNames = AREA_MATERIAL_MAP[area] ?? [];
      matNames.forEach((n) => names.add(n.toLowerCase()));
    });
    return names;
  }, []);

  const applyMaterials = useCallback(
    (currentStep: BrainStoryStep) => {
      const viewer = viewerRef.current;
      if (!viewer?.model) return;

      const highlightSet = getMaterialsToHighlight(currentStep.highlightAreas);

      viewer.model.materials.forEach((mat) => {
        const nameLower = mat.name.toLowerCase();

        if (currentStep.allRed) {
          mat.pbrMetallicRoughness.setBaseColorFactor(RED_COLOR);
          mat.setEmissiveFactor(RED_EMISSIVE);
        } else if (highlightSet.size > 0 && highlightSet.has(nameLower)) {
          mat.pbrMetallicRoughness.setBaseColorFactor(HIGHLIGHT_COLOR);
          mat.setEmissiveFactor(HIGHLIGHT_EMISSIVE);
        } else {
          mat.pbrMetallicRoughness.setBaseColorFactor(NORMAL_COLOR);
          mat.setEmissiveFactor(NORMAL_EMISSIVE);
        }
      });
    },
    [getMaterialsToHighlight]
  );

  const handleLoad = useCallback(() => {
    // Aggiungiamo un piccolo timeout per assicurarci che il motore di rendering 
    // del model-viewer abbia effettivamente compilato e disegnato i materiali
    setTimeout(() => {
      modelLoadedRef.current = true;
      applyMaterials(step);
      onLoad?.();
    }, 150);
  }, [applyMaterials, step, onLoad]);

  // Update materials and camera when step changes
  useEffect(() => {
    if (!modelLoadedRef.current) return;
    applyMaterials(step);
  }, [step, applyMaterials]);

  // Update camera orbit when step changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.setAttribute('camera-orbit', step.cameraOrbit);
    viewer.setAttribute('camera-target', step.cameraTarget);
  }, [step.cameraOrbit, step.cameraTarget]);

  // Handle animation play/pause
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

  const handleARStatus = useCallback(
    (e: Event) => {
      const customEvent = e as CustomEvent<{ status: string }>;
      onARStatus?.(customEvent.detail?.status ?? '');
    },
    [onARStatus]
  );

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.addEventListener('ar-status', handleARStatus);
    return () => viewer.removeEventListener('ar-status', handleARStatus);
  }, [handleARStatus]);

  return (
    <div className="relative w-full h-full">
      {/* @ts-ignore — custom element handled via model-viewer.d.ts */}
      <model-viewer
        ref={viewerRef}
        src="/models/cervello.glb"
        ios-src="/models/cervello.usdz"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        camera-controls
        touch-action="pan-y"
        interaction-prompt="none"
        shadow-intensity="0.8"
        environment-image="neutral"
        exposure="1.1"
        min-camera-orbit="auto auto 1.2m"
        max-camera-orbit="auto auto 4m"
        field-of-view="35deg"
        auto-rotate
        auto-rotate-delay="5000"
        loading="eager"
        poster="/assets/images/usa-la-testa_logo-white.png"
        reveal="auto"
        alt="Modello 3D interattivo del cervello umano"
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        onLoad={handleLoad}
      >
        <button
          slot="ar-button"
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2.5 rounded-full border border-white/30 shadow-lg"
          style={{ zIndex: 10 }}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
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
