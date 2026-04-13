import { useState, useCallback, useRef, useEffect } from 'react';
import type { BrainExperienceState } from '../types/brain';
import { BRAIN_STEPS } from '../data/brainStory';

export function useBrainExperience() {
  const [state, setState] = useState<BrainExperienceState>({
    currentStep: 0,
    isPlaying: false,
    isARActive: false,
    hasCompletedOnce: false,
    phase: 'intro',
  });

  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  }, []);

  const scheduleAutoAdvance = useCallback(
    (stepIndex: number) => {
      clearTimer();
      const step = BRAIN_STEPS[stepIndex];
      if (!step) return;

      autoAdvanceTimer.current = setTimeout(() => {
        setState((prev) => {
          if (!prev.isPlaying) return prev;
          const nextStep = prev.currentStep + 1;
          if (nextStep >= BRAIN_STEPS.length) {
            return { ...prev, isPlaying: false, hasCompletedOnce: true, phase: 'complete' };
          }
          return { ...prev, currentStep: nextStep };
        });
      }, step.duration * 1000);
    },
    [clearTimer]
  );

  useEffect(() => {
    if (state.isPlaying && state.phase === 'experience') {
      scheduleAutoAdvance(state.currentStep);
    }
    return clearTimer;
  }, [state.isPlaying, state.currentStep, state.phase, scheduleAutoAdvance, clearTimer]);

  const startExperience = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 'experience',
      currentStep: 0,
      isPlaying: true,
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step < 0 || step >= BRAIN_STEPS.length) return;
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const nextStep = useCallback(() => {
    clearTimer();
    setState((prev) => {
      const next = prev.currentStep + 1;
      if (next >= BRAIN_STEPS.length) {
        return { ...prev, isPlaying: false, hasCompletedOnce: true, phase: 'complete' };
      }
      return { ...prev, currentStep: next };
    });
  }, [clearTimer]);

  const prevStep = useCallback(() => {
    clearTimer();
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
      isPlaying: false,
    }));
  }, [clearTimer]);

  const togglePlay = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const setARActive = useCallback((active: boolean) => {
    setState((prev) => ({ ...prev, isARActive: active }));
  }, []);

  const restart = useCallback(() => {
    clearTimer();
    setState((prev) => ({
      ...prev,
      currentStep: 0,
      isPlaying: true,
      phase: 'experience',
    }));
  }, [clearTimer]);

  return {
    state,
    currentStepData: BRAIN_STEPS[state.currentStep],
    totalSteps: BRAIN_STEPS.length,
    startExperience,
    goToStep,
    nextStep,
    prevStep,
    togglePlay,
    setARActive,
    restart,
  };
}
