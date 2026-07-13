import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LabyrinthIntro from '../components/labyrinth/LabyrinthIntro';
import LabyrinthGame from '../components/labyrinth/LabyrinthGame';
import LabyrinthResult from '../components/labyrinth/LabyrinthResult';
import { X } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const EXPERIENCE_NAME = 'labyrinth';

type ExperiencePhase = 'intro' | 'playing' | 'result';

export default function LabyrinthExperience() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<ExperiencePhase>('intro');
  const [realTimeMs, setRealTimeMs] = useState<number>(0);

  const handleStart = () => {
    trackEvent('experience_start', { experience_name: EXPERIENCE_NAME });
    setPhase('playing');
  };

  const handleGameComplete = (time: number) => {
    trackEvent('experience_end', { experience_name: EXPERIENCE_NAME });
    setRealTimeMs(time);
    setPhase('result');
  };

  const handleRestart = () => {
    setPhase('playing');
  };

  const handleExit = () => {
    navigate('/games');
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900 overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(160deg, #0B2A57 0%, #1a1a2e 50%, #4195A4 100%)' }}
    >
      {/* Top Navigation Bar - Only visible during gameplay */}
      {phase === 'playing' && (
        <div className="absolute top-0 inset-x-0 z-50 pointer-events-none">
          <div className="flex items-start justify-between px-6 pt-6 pb-2">
            <button
              onClick={handleExit}
              className="pointer-events-auto flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Intro Phase */}
      {phase === 'intro' && (
        <LabyrinthIntro onStart={handleStart} onExit={handleExit} />
      )}

      {/* Playing Phase */}
      {phase === 'playing' && (
        <LabyrinthGame onComplete={handleGameComplete} />
      )}

      {/* Result Phase */}
      {phase === 'result' && (
        <LabyrinthResult 
          realTimeMs={realTimeMs} 
          onRestart={handleRestart}
          onExit={handleExit}
        />
      )}
    </div>
  );
}
