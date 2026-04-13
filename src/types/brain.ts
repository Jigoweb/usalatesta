export interface BrainStoryStep {
  id: number;
  title: string;
  text: string;
  highlightAreas: string[];
  cameraOrbit: string;
  cameraTarget: string;
  colorOverride?: Record<string, [number, number, number, number]>;
  allRed?: boolean;
  playAnimation?: boolean;
  duration: number;
  overlay?: {
    dopamineBar?: boolean;
    icons?: Array<'dna' | 'heart' | 'house'>;
  };
}

export interface BrainExperienceState {
  currentStep: number;
  isPlaying: boolean;
  isARActive: boolean;
  hasCompletedOnce: boolean;
  phase: 'intro' | 'experience' | 'complete';
}
