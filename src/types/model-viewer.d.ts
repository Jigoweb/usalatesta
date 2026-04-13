import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & ModelViewerAttributes,
        HTMLElement
      >;
    }
  }
}

interface ModelViewerAttributes {
  src?: string;
  'ios-src'?: string;
  poster?: string;
  alt?: string;
  ar?: boolean | string;
  'ar-modes'?: string;
  'ar-scale'?: string;
  'camera-controls'?: boolean | string;
  'touch-action'?: string;
  'auto-rotate'?: boolean | string;
  'auto-rotate-delay'?: string;
  'camera-orbit'?: string;
  'camera-target'?: string;
  'min-camera-orbit'?: string;
  'max-camera-orbit'?: string;
  'field-of-view'?: string;
  'shadow-intensity'?: string;
  'environment-image'?: string;
  exposure?: string;
  loading?: 'auto' | 'lazy' | 'eager';
  'interaction-prompt'?: 'auto' | 'none';
  'animation-name'?: string;
  autoplay?: boolean | string;
  onLoad?: React.EventHandler<React.SyntheticEvent<HTMLElement>>;
  onError?: React.EventHandler<React.SyntheticEvent<HTMLElement>>;
  onArStatus?: React.EventHandler<React.SyntheticEvent<HTMLElement>>;
}

export interface ModelViewerElement extends HTMLElement {
  model: {
    materials: ModelViewerMaterial[];
  } | null;
  cameraOrbit: string;
  cameraTarget: string;
  fieldOfView: string;
  play: (options?: { repetitions?: number }) => void;
  pause: () => void;
  activateAR: () => void;
  animationName: string;
}

export type AlphaMode = 'OPAQUE' | 'MASK' | 'BLEND';

export interface ModelViewerMaterial {
  name: string;
  alphaMode: AlphaMode;
  alphaCutoff: number;
  pbrMetallicRoughness: {
    baseColorFactor: [number, number, number, number];
    setBaseColorFactor: (factor: [number, number, number, number]) => void;
  };
  setEmissiveFactor: (factor: [number, number, number]) => void;
  emissiveFactor: [number, number, number];
  setAlphaMode: (mode: AlphaMode) => void;
  setAlphaCutoff: (value: number) => void;
}
