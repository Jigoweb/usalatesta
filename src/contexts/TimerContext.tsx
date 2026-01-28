import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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

interface TimerContextType {
  timerState: TimerState;
  history: TimerHistory[];
  startTimer: (minutes: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
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

  // Timer tick logic - runs continuously even when Timer page is not mounted
  useEffect(() => {
    if (timerState.isActive && !timerState.isPaused && timerState.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimerState((prev) => {
          if (!prev.isActive || prev.isPaused) return prev;
          
          const now = Date.now();
          if (prev.endTime) {
            const remaining = Math.max(0, Math.ceil((prev.endTime - now) / 1000));
            
            if (remaining <= 0) {
              // Timer finished
              const finalState = { ...prev, timeRemaining: 0 };
              completeTimer(finalState);
              return DEFAULT_STATE;
            }
            
            return { ...prev, timeRemaining: remaining };
          }
          
          const newRemaining = prev.timeRemaining - 1;
          if (newRemaining <= 0) {
            const finalState = { ...prev, timeRemaining: 0 };
            completeTimer(finalState);
            return DEFAULT_STATE;
          }
          
          return { ...prev, timeRemaining: newRemaining };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState.isActive, timerState.isPaused]);

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

    // Save to recent history
    const newHistoryItem: TimerHistory = {
      id: Date.now().toString(),
      duration: minutes,
      completedAt: now,
      wasCompleted: false,
    };

    setHistory((prev) => {
      const updated = [newHistoryItem, ...prev.filter(item => item.id !== newHistoryItem.id)].slice(0, 10);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
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

    setHistory((prev) => {
      const updated = [newHistoryItem, ...prev.filter(item => item.id !== newHistoryItem.id)].slice(0, 10);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <TimerContext.Provider
      value={{
        timerState,
        history,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
