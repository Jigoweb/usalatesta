export interface BrainStoryStep {
  id: number;
  title: string;
  text: string;
  highlightAreas: string[];
  cameraOrbit: string;
  cameraTarget: string;
  allRed?: boolean;
  animationName?: string;
  duration: number;
  overlay?: {
    /** Dopamine bar shown only when explicitly annotated in the script */
    dopamineLevel?: 'bassa' | 'media' | 'alta';
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
