import { useState } from 'react';
import { useTimer } from '../hooks/useTimer';
import { Play, Pause, Square, Clock, RotateCcw } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Timer() {
  const { timerState, history, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();
  const [customTime, setCustomTime] = useState<string>('');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCustomStart = () => {
    const minutes = parseInt(customTime);
    if (minutes > 0) {
      startTimer(minutes);
      setCustomTime('');
    }
  };

  const presets = [15, 30, 45, 60];

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
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      <h1 className="text-2xl font-bold text-primary-blue mb-6">Timer di gioco</h1>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Clock className="mr-2 text-secondary-orange" size={20} />
          Imposta durata
        </h2>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {presets.map((min) => (
            <button
              key={min}
              onClick={() => startTimer(min)}
              className="py-4 bg-blue-50 text-primary-blue font-bold rounded-xl hover:bg-primary-blue hover:text-white transition-colors"
            >
              {min} min
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="number"
            placeholder="Minuti personalizzati"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue"
          />
          <button
            onClick={handleCustomStart}
            disabled={!customTime}
            className="p-3 bg-primary-blue text-white rounded-xl disabled:opacity-50"
          >
            <Play size={24} fill="currentColor" />
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <RotateCcw className="mr-2 text-gray-400" size={20} />
            Recenti
          </h2>
          
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-600 font-medium">{item.duration} minuti</span>
                <button
                  onClick={() => startTimer(item.duration)}
                  className="text-sm text-primary-blue font-semibold px-3 py-1 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  Ripeti
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}