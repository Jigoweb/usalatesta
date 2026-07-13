import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { TimerState, TimerHistory } from '../types';
import { trackEvent } from '../utils/analytics';

const STORAGE_KEY = 'usalatesta_timer_state';
const HISTORY_KEY = 'usalatesta_timer_history';

const DEFAULT_STATE: TimerState = {
  duration: 0,
  timeRemaining: 0,
  isActive: false,
  isPaused: false,
  startTime: null,
  endTime: null,
  notifiedQuarters: [],
};

const sendPushNotification = (title: string, message: string) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, {
        body: message,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        vibrate: [200, 100, 200]
      } as NotificationOptions);
    }).catch(() => {
      new Notification(title, { body: message, icon: '/pwa-192x192.png' });
    });
  } else {
    new Notification(title, { body: message, icon: '/pwa-192x192.png' });
  }
};

const checkNotifications = (prevState: TimerState, remainingSec: number): number[] => {
  if (!prevState.duration) return prevState.notifiedQuarters || [];
  const totalDurationSec = Math.floor(prevState.duration * 60);
  const elapsedSec = totalDurationSec - remainingSec;
  
  const currentNotified = prevState.notifiedQuarters || [];
  const newlyNotified = [...currentNotified];
  
  const notify = (quarter: number, title: string, message: string) => {
     if (!currentNotified.includes(quarter)) {
        newlyNotified.push(quarter);
        sendPushNotification(title, message);
     }
  };

  // Metà sessione (marcatore 2)
  if (elapsedSec >= totalDurationSec * 0.50 && !currentNotified.includes(2)) {
     notify(2, "Sei a metà del tempo prefissato", "Gioca con equilibrio e mantieni il controllo.");
  }
  
  return newlyNotified;
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
      const parsed: TimerHistory[] = JSON.parse(savedHistory);
      const seen = new Set<number>();
      const deduped = parsed.filter((item) => {
        if (seen.has(item.duration)) return false;
        seen.add(item.duration);
        return true;
      });
      const sanitized = deduped.slice(0, 4);
      setHistory(sanitized);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(sanitized));
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
              sendPushNotification("Il tempo di gioco è terminato ora", "È il momento di staccare un po’ e fare altro.");
              return DEFAULT_STATE;
            }
            
            const newNotified = checkNotifications(prev, remaining);
            return { ...prev, timeRemaining: remaining, notifiedQuarters: newNotified };
          }
          
          const newRemaining = prev.timeRemaining - 1;
          if (newRemaining <= 0) {
            const finalState = { ...prev, timeRemaining: 0 };
            completeTimer(finalState);
            sendPushNotification("Il tempo di gioco è terminato ora", "È il momento di staccare un po’ e fare altro.");
            return DEFAULT_STATE;
          }
          
          const newNotifiedFallback = checkNotifications(prev, newRemaining);
          return { ...prev, timeRemaining: newRemaining, notifiedQuarters: newNotifiedFallback };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState.isActive, timerState.isPaused]);

  const startTimer = useCallback((minutes: number) => {
    trackEvent('countdown_start', { timing_set: minutes });

    // Request notification permission on first timer start
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        sendPushNotification("Hai scelto il tuo tempo di gioco", "Divertiti con equilibrio, ricordando che è solo un gioco.");
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            sendPushNotification("Hai scelto il tuo tempo di gioco", "Divertiti con equilibrio, ricordando che è solo un gioco.");
          }
        });
      }
    }

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
      notifiedQuarters: [],
    });

    // Save to recent history (no duplicate durations, max 4)
    const newHistoryItem: TimerHistory = {
      id: Date.now().toString(),
      duration: minutes,
      completedAt: now,
      wasCompleted: false,
    };

    setHistory((prev) => {
      if (prev.some((item) => item.duration === minutes)) return prev;
      const updated = [newHistoryItem, ...prev].slice(0, 4);
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
    setTimerState((prev) => {
      if (prev.isActive) trackEvent('countdown_end', { end_type: 'stopped' });
      return DEFAULT_STATE;
    });
  }, []);

  const completeTimer = (finalState: TimerState) => {
    trackEvent('countdown_end', { end_type: 'ended' });
    const newHistoryItem: TimerHistory = {
      id: Date.now().toString(),
      duration: finalState.duration,
      completedAt: Date.now(),
      wasCompleted: true,
    };

    setHistory((prev) => {
      if (prev.some((item) => item.duration === finalState.duration)) return prev;
      const updated = [newHistoryItem, ...prev].slice(0, 4);
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
