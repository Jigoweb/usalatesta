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

  // Keep latest props in refs so the one-time load handler sees current values
  const latestRef = useRef({ step, onLoad, onARStatus });
  useEffect(() => {
    latestRef.current = { step, onLoad, onARStatus };
  });

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

  // Attach load listener via addEventListener — React's onLoad prop
  // is unreliable for model-viewer's custom `load` event dispatch.
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      // Small delay so model-viewer has finalised its material objects
      setTimeout(() => {
        modelLoadedRef.current = true;
        applyMaterials(latestRef.current.step);
        latestRef.current.onLoad?.();
      }, 100);
    };

    viewer.addEventListener('load', handleLoad);
    return () => viewer.removeEventListener('load', handleLoad);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update materials when step changes
  useEffect(() => {
    if (!modelLoadedRef.current) return;
    applyMaterials(step);
  }, [step, applyMaterials]);

  // Update camera imperatively so model-viewer reacts to step transitions
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.setAttribute('camera-orbit', step.cameraOrbit);
    viewer.setAttribute('camera-target', step.cameraTarget);
  }, [step.cameraOrbit, step.cameraTarget]);

  // Animation for ciliegie step
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

  // AR status listener
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleARStatus = (e: Event) => {
      const customEvent = e as CustomEvent<{ status: string }>;
      latestRef.current.onARStatus?.(customEvent.detail?.status ?? '');
    };

    viewer.addEventListener('ar-status', handleARStatus);
    return () => viewer.removeEventListener('ar-status', handleARStatus);
  }, []);

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
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '600',
            padding: '0.625rem 1rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            cursor: 'pointer',
          }}
        >
          <svg
            width="16"
            height="16"
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
