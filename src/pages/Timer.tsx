import { useState, useRef, useEffect } from 'react';
import { useTimer } from '../contexts/TimerContext';
import { Play, Pause, Square } from 'lucide-react';
import { cn } from '../utils/cn';

// Componente per il picker scrollabile in stile iOS
function TimePicker({ hours, minutes, onHoursChange, onMinutesChange }: {
  hours: number;
  minutes: number;
  onHoursChange: (h: number) => void;
  onMinutesChange: (m: number) => void;
}) {
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemHeight = 72; // Altezza maggiore per migliore UX iOS-style
  const initializedRef = useRef(false);

  // Inizializzazione corretta al mount per allineare 00:00:00
  useEffect(() => {
    if (!initializedRef.current) {
      // Usa doppio requestAnimationFrame per assicurarsi che il DOM sia completamente renderizzato e misurato
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (hoursRef.current && minutesRef.current) {
            // Calcola il padding necessario per centrare il primo elemento
            const containerHeight = 216; // maxHeight del container
            const paddingNeeded = (containerHeight - itemHeight) / 2;
            
            // Imposta lo scroll iniziale a 0 (00:00) - il padding nel renderNumbers centrerà automaticamente
            hoursRef.current.scrollTop = 0;
            minutesRef.current.scrollTop = 0;
            
            // Forza un reflow per assicurarsi che lo scroll sia applicato
            hoursRef.current.offsetHeight;
            minutesRef.current.offsetHeight;
            
            initializedRef.current = true;
          }
        });
      });
    }
  }, [itemHeight]);

  // Aggiorna lo scroll quando cambiano hours o minutes (dopo l'inizializzazione)
  useEffect(() => {
    if (initializedRef.current && hoursRef.current) {
      // Per le ore, tutti i valori sono disponibili
      const hoursNumbers = Array.from({ length: 24 }, (_, i) => i);
      const hoursIndex = hoursNumbers.indexOf(hours);
      if (hoursIndex >= 0) {
        hoursRef.current.scrollTop = hoursIndex * itemHeight;
      }
    }
  }, [hours, itemHeight]);

  useEffect(() => {
    if (initializedRef.current && minutesRef.current) {
      // Per i minuti, solo multipli di 5
      const minutesNumbers = Array.from({ length: 60 }, (_, i) => i).filter(num => num % 5 === 0);
      const minutesIndex = minutesNumbers.indexOf(minutes);
      if (minutesIndex >= 0) {
        minutesRef.current.scrollTop = minutesIndex * itemHeight;
      }
    }
  }, [minutes, itemHeight]);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>, onChange: (value: number) => void, numbers: number[]) => {
    if (!ref.current) return;
    
    // Debounce per evitare troppi aggiornamenti durante lo scroll
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (!ref.current) return;
      const scrollTop = ref.current.scrollTop;
      const selectedIndex = Math.round(scrollTop / itemHeight);
      // Assicurati che l'indice sia valido
      if (selectedIndex >= 0 && selectedIndex < numbers.length) {
        onChange(numbers[selectedIndex]);
        // Snap to position con smooth scroll
        ref.current.scrollTo({ top: selectedIndex * itemHeight, behavior: 'smooth' });
      }
    }, 50);
  };

  const renderNumbers = (max: number, selected: number, ref: React.RefObject<HTMLDivElement>, onChange: (value: number) => void, step: number = 1) => {
    // Filtra i numeri in base allo step (es. step=5 per multipli di 5)
    const numbers = Array.from({ length: max + 1 }, (_, i) => i).filter(num => num % step === 0);
    const containerHeight = 216;
    const paddingValue = (containerHeight - itemHeight) / 2; // 72px per centrare il primo elemento
    const selectionAreaTop = paddingValue; // La linea di selezione è alla stessa altezza del padding
    
    // Trova l'indice corretto nel array filtrato
    const selectedIndex = numbers.indexOf(selected);
    const actualSelected = selectedIndex >= 0 ? selected : numbers[0];
    
    return (
      <div className="relative flex-1 max-w-[140px] h-[216px] flex items-center">
        {/* Linee di selezione iOS-style più sottili */}
        <div 
          className="absolute left-0 right-0 border-t border-gray-300 z-20 pointer-events-none"
          style={{ top: `${paddingValue}px`, height: '1px' }}
        />
        <div 
          className="absolute left-0 right-0 border-b border-gray-300 z-20 pointer-events-none"
          style={{ top: `${paddingValue + itemHeight}px`, height: '1px' }}
        />
        
        {/* Overlay fade superiore e inferiore più pronunciato */}
        <div 
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-white via-white/95 to-white/60 z-10 pointer-events-none"
          style={{ height: `${paddingValue}px` }}
        />
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-white/60 z-10 pointer-events-none"
          style={{ height: `${paddingValue}px` }}
        />
        
        <div
          ref={ref}
          className="overflow-y-auto scrollbar-hide snap-y snap-mandatory w-full h-full"
          style={{ 
            WebkitOverflowScrolling: 'touch', // Momentum scroll su iOS
            scrollBehavior: 'smooth'
          }}
          onScroll={() => handleScroll(ref, onChange, numbers)}
        >
          <div style={{ paddingTop: `${paddingValue}px`, paddingBottom: `${paddingValue}px` }}>
            {numbers.map((num, index) => {
              const distance = Math.abs(index - selectedIndex);
              // Opacità più pronunciata per effetto iOS
              const opacity = num === actualSelected ? 1 : Math.max(0.2, 1 - distance * 0.35);
              // Scala più pronunciata per elemento selezionato
              const scale = num === actualSelected ? 1 : Math.max(0.8, 1 - distance * 0.08);
              // Dimensione font più grande per elemento selezionato
              const fontSize = num === actualSelected ? '72px' : distance === 1 ? '56px' : '44px';
              
              return (
                <div
                  key={num}
                  className={cn(
                    "flex items-center justify-center snap-center transition-all duration-300 ease-out",
                    "font-custom-timer",
                    num === actualSelected ? "text-gray-900" : "text-gray-400"
                  )}
                  style={{ 
                    height: `${itemHeight}px`,
                    opacity, 
                    transform: `scale(${scale})`,
                    fontSize: fontSize,
                    fontWeight: 700,
                    lineHeight: 1
                  }}
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
    <div className="flex items-end justify-center gap-3 mb-8 px-4" style={{ height: '216px' }}>
      {renderNumbers(23, hours, hoursRef, onHoursChange, 1)}
      <span className="text-gray-900 font-custom-timer" style={{ fontSize: '72px', fontWeight: 700, lineHeight: 1, paddingBottom: '72px' }}>:</span>
      {renderNumbers(59, minutes, minutesRef, onMinutesChange, 5)}
      <span className="text-gray-400 font-custom-timer ml-1" style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1, paddingBottom: '0px', paddingTop: '95px', alignSelf: 'flex-end', verticalAlign: 'bottom', height: '100%' }}>:00</span>
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