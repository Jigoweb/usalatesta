import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerState, TimerHistory } from '../types';

const STORAGE_KEY = 'usalatesta_timer_state';
const HISTORY_KEY = 'usalatesta_timer_history';

const DEFAULT_STATE: TimerState = {
  duration: 0,
  timeRemaining: 0,
  isActive: false,
  isPaused: false,
  startTime: null,
  endTime: null,
};

export function useTimer() {
  const [timerState, setTimerState] = useState<TimerState>(DEFAULT_STATE);
  const [history, setHistory] = useState<TimerHistory[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load state and history on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    const savedHistory = localStorage.getItem(HISTORY_KEY);

    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // If timer was active, calculate remaining time based on current time
      if (parsedState.isActive && !parsedState.isPaused && parsedState.endTime) {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((parsedState.endTime - now) / 1000));
        
        if (remaining > 0) {
          setTimerState({ ...parsedState, timeRemaining: remaining });
        } else {
          // Timer finished while app was closed
          setTimerState(DEFAULT_STATE);
          // Ideally we would add to history here if we tracked "completed while closed"
        }
      } else {
        setTimerState(parsedState);
      }
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timerState));
  }, [timerState]);

  // Timer tick logic
  useEffect(() => {
    if (timerState.isActive && !timerState.isPaused && timerState.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimerState((prev) => {
          const newRemaining = prev.timeRemaining - 1;
          
          if (newRemaining <= 0) {
            // Timer finished
            completeTimer(prev);
            return DEFAULT_STATE;
          }
          
          return { ...prev, timeRemaining: newRemaining };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState.isActive, timerState.isPaused, timerState.timeRemaining]);

  const startTimer = useCallback((minutes: number) => {
    const now = Date.now();
    const durationSec = minutes * 60;
    const endTime = now + durationSec * 1000;

    setTimerState({
      duration: minutes,
      timeRemaining: durationSec,
      isActive: true,
      isPaused: false,
      startTime: now,
      endTime: endTime,
    });
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerState((prev) => ({ ...prev, isPaused: true }));
  }, []);

  const resumeTimer = useCallback(() => {
    setTimerState((prev) => {
      const now = Date.now();
      // Recalculate end time based on remaining seconds
      const endTime = now + prev.timeRemaining * 1000;
      return { ...prev, isPaused: false, endTime };
    });
  }, []);

  const stopTimer = useCallback(() => {
    setTimerState(DEFAULT_STATE);
  }, []);

  const completeTimer = (finalState: TimerState) => {
    const newHistoryItem: TimerHistory = {
      id: Date.now().toString(),
      duration: finalState.duration,
      completedAt: Date.now(),
      wasCompleted: true,
    };

    const newHistory = [newHistoryItem, ...history].slice(0, 10); // Keep last 10
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  return {
    timerState,
    history,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
  };
}