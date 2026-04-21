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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const clearTimer = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  }, []);

  const scheduleAutoAdvance = useCallback(
    (stepIndex: number, forceTimer: boolean = false) => {
      clearTimer();
      const step = BRAIN_STEPS[stepIndex];
      if (!step) return;

      // Se non c'è audio o c'è stato un errore (override con forceTimer=true), usa il timer normale
      if (!step.audioUrl || forceTimer) {
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
      }
    },
    [clearTimer]
  );

  // Pulizia dell'audio in fase di uscita o smontaggio globale
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.onended = null;
        audioRef.current = null;
      }
    };
  }, []);

  // Gestione dell'audio e della sincronizzazione con isPlaying e lo step
  useEffect(() => {
    const step = BRAIN_STEPS[state.currentStep];
    
    // Pulizia dell'audio precedente se cambiamo step o usciamo
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current = null;
    }

    if (state.phase !== 'experience' || !step?.audioUrl) return;

    // Inizializza nuovo audio
    const audio = new Audio(step.audioUrl);
    audioRef.current = audio;

    // Quando l'audio finisce, passa allo step successivo (sostituisce il timer)
    audio.onended = () => {
      setState((prev) => {
        if (!prev.isPlaying) return prev;
        const nextStep = prev.currentStep + 1;
        if (nextStep >= BRAIN_STEPS.length) {
          return { ...prev, isPlaying: false, hasCompletedOnce: true, phase: 'complete' };
        }
        return { ...prev, currentStep: nextStep };
      });
    };

    // Gestione play/pause basata sullo stato
    if (state.isPlaying) {
      audio.play().catch((err) => {
        console.error('Audio playback failed:', err);
        // Fallback: se l'audio fallisce (es. blocco autoplay browser),
        // passiamo al timer standard usando la durata prefissata nello step
        scheduleAutoAdvance(state.currentStep, true);
      });
    } else {
      audio.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }
    };
  }, [state.currentStep, state.isPlaying, state.phase, scheduleAutoAdvance]);

  useEffect(() => {
    if (state.isPlaying && state.phase === 'experience') {
      const step = BRAIN_STEPS[state.currentStep];
      // Solo se non c'è audio, scheduleAutoAdvance gestisce l'avanzamento.
      // Se c'è audio, ci pensa l'evento onended configurato sopra.
      if (!step?.audioUrl) {
        scheduleAutoAdvance(state.currentStep);
      }
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
