import { useState, useRef, useEffect } from 'react';
import { useTimer } from '../contexts/TimerContext';
import { Play, Pause, Square } from 'lucide-react';
import { cn } from '../utils/cn';

// Componente per il picker scrollabile
function TimePicker({ hours, minutes, onHoursChange, onMinutesChange }: {
  hours: number;
  minutes: number;
  onHoursChange: (h: number) => void;
  onMinutesChange: (m: number) => void;
}) {
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const itemHeight = 60;

  useEffect(() => {
    if (hoursRef.current) {
      hoursRef.current.scrollTop = hours * itemHeight;
    }
  }, [hours]);

  useEffect(() => {
    if (minutesRef.current) {
      minutesRef.current.scrollTop = minutes * itemHeight;
    }
  }, [minutes]);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>, onChange: (value: number) => void) => {
    if (!ref.current) return;
    const scrollTop = ref.current.scrollTop;
    const selectedIndex = Math.round(scrollTop / itemHeight);
    onChange(selectedIndex);
    // Snap to position
    ref.current.scrollTo({ top: selectedIndex * itemHeight, behavior: 'smooth' });
  };

  const renderNumbers = (max: number, selected: number, ref: React.RefObject<HTMLDivElement>, onChange: (value: number) => void) => {
    const numbers = Array.from({ length: max + 1 }, (_, i) => i);
    return (
      <div className="relative flex-1">
        {/* Overlay per l'effetto fade */}
        <div className="absolute top-0 left-0 right-0 h-[90px] bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[90px] bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
        
        <div
          ref={ref}
          className="overflow-y-auto scrollbar-hide snap-y snap-mandatory"
          style={{ maxHeight: '180px' }}
          onScroll={() => handleScroll(ref, onChange)}
        >
          <div className="py-[90px]">
            {numbers.map((num) => {
              const distance = Math.abs(num - selected);
              const opacity = distance === 0 ? 1 : Math.max(0.2, 1 - distance * 0.3);
              const scale = distance === 0 ? 1.1 : Math.max(0.9, 1 - distance * 0.05);
              
              return (
                <div
                  key={num}
                  className={cn(
                    "h-[60px] flex items-center justify-center text-5xl font-bold snap-center transition-all duration-200",
                    num === selected ? "text-gray-900" : "text-gray-400"
                  )}
                  style={{ opacity, transform: `scale(${scale})` }}
                >
                  {num.toString().padStart(2, '0')}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {renderNumbers(23, hours, hoursRef, onHoursChange)}
      <span className="text-5xl font-bold text-gray-900">:</span>
      {renderNumbers(59, minutes, minutesRef, onMinutesChange)}
      <span className="text-3xl font-bold text-gray-400 ml-2">:00</span>
    </div>
  );
}

export default function Timer() {
  const { timerState, history, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();
  const [selectedHours, setSelectedHours] = useState<number>(0);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCustomStart = () => {
    const totalMinutes = selectedHours * 60 + selectedMinutes;
    if (totalMinutes > 0) {
      startTimer(totalMinutes);
    }
  };

  const formatRecentTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours} ora, ${mins} min`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'ora' : 'ore'}`;
    } else {
      return `${mins} min`;
    }
  };

  const formatRecentDisplay = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  if (timerState.isActive) {
    return (
      <div className="min-h-screen bg-primary-blue flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-light-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

        <div className="z-10 text-center w-full max-w-md">
          <h2 className="text-blue-200 text-xl font-medium mb-8">Tempo rimanente</h2>
          
          <div className="text-[6rem] font-bold text-white font-sans tracking-tighter leading-none mb-12">
            {formatTime(timerState.timeRemaining)}
          </div>

          <div className="flex justify-center space-x-8">
            {timerState.isPaused ? (
              <button 
                onClick={resumeTimer}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-colors"
              >
                <Play size={32} fill="currentColor" />
              </button>
            ) : (
              <button 
                onClick={pauseTimer}
                className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-yellow-600 transition-colors"
              >
                <Pause size={32} fill="currentColor" />
              </button>
            )}
            
            <button 
              onClick={stopTimer}
              className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-colors"
            >
              <Square size={32} fill="currentColor" />
            </button>
          </div>
          
          <div className="mt-12 text-blue-200/60 text-sm">
            Sessione da {timerState.duration} minuti
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Timer del giocatore</h1>
      <p className="text-sm text-gray-600 mb-8">Scegli quanto far durare la tua sessione di gioco</p>
      
      <div className="mb-8">
        <TimePicker
          hours={selectedHours}
          minutes={selectedMinutes}
          onHoursChange={setSelectedHours}
          onMinutesChange={setSelectedMinutes}
        />
        
        <button
          onClick={handleCustomStart}
          disabled={selectedHours === 0 && selectedMinutes === 0}
          className="w-full py-4 bg-primary-blue text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Avvia il timer
        </button>
      </div>

      {history.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recenti</h2>
          
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{formatRecentDisplay(item.duration)}</div>
                  <div className="text-sm text-gray-500">{formatRecentTime(item.duration)}</div>
                </div>
                <button
                  onClick={() => startTimer(item.duration)}
                  className="w-12 h-12 rounded-full border-2 border-primary-blue flex items-center justify-center hover:bg-blue-50 transition-colors"
                >
                  <Play size={20} fill="currentColor" className="text-primary-blue ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}