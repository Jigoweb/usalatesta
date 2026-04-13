import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, MessageCircle, HelpCircle } from 'lucide-react';
import BrainIntro from '../components/brain/BrainIntro';
import BrainViewer from '../components/brain/BrainViewer';
import BrainStoryOverlay from '../components/brain/BrainStoryOverlay';
import { useBrainExperience } from '../hooks/useBrainExperience';

export default function BrainExperience() {
  const navigate = useNavigate();
  const [modelLoaded, setModelLoaded] = useState(false);

  const {
    state,
    currentStepData,
    totalSteps,
    startExperience,
    nextStep,
    prevStep,
    togglePlay,
    setARActive,
    restart,
  } = useBrainExperience();

  // Preload the 3D model when the intro page is shown
  useEffect(() => {
    if (state.phase === 'intro') {
      const controller = new AbortController();
      
      // Hidden fetch to start downloading the .glb file into the browser's cache
      fetch('/models/cervello.glb', { signal: controller.signal })
        .catch(err => {
           if (err.name === 'AbortError') {
             console.log('Model preload aborted');
           }
        });
        
      return () => {
        // Abort the download if the user leaves the intro page before it finishes
        controller.abort();
      };
    }
  }, [state.phase]);

  const handleModelLoad = () => {
    setModelLoaded(true);
  };

  if (state.phase === 'intro') {
    return <BrainIntro onStart={startExperience} />;
  }

  if (state.phase === 'complete') {
    return (
      <div
        className="min-h-screen flex flex-col relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0B2A57 0%, #1a1a2e 50%, #9D2050 100%)' }}
      >
        <button
          onClick={() => navigate('/games')}
          className="absolute top-12 left-4 z-10 flex items-center gap-1.5 text-white/70 text-sm font-medium"
        >
          <X className="w-4 h-4" />
          Chiudi
        </button>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mb-6"
          >
            <span className="text-4xl">🧠</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-3"
          >
            Esperienza completata!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-white/70 text-base leading-relaxed mb-10 max-w-xs"
          >
            Ora sai come funziona il tuo cervello durante il gioco. Ricorda: il primo
            passo è riconoscere il problema.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-xs space-y-3"
          >
            <button
              onClick={() => navigate('/support')}
              className="w-full flex items-center justify-center gap-2.5 bg-white text-slate-900 font-bold py-4 rounded-2xl shadow-xl hover:bg-white/90 active:scale-95 transition-all"
            >
              <HelpCircle className="w-5 h-5" />
              Cerca supporto
            </button>

            <button
              onClick={() => navigate('/chatbot')}
              className="w-full flex items-center justify-center gap-2.5 bg-white/15 text-white font-semibold py-4 rounded-2xl border border-white/20 hover:bg-white/20 active:scale-95 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Parla con l'assistente
            </button>

            <button
              onClick={restart}
              className="w-full flex items-center justify-center gap-2 text-white/60 text-sm font-medium py-3 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Rivedi l'esperienza
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Experience phase
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a1628 0%, #12203a 100%)' }}
    >
      {/* Header */}
      <div className="absolute top-0 inset-x-0 z-30 pt-safe">
        <div className="flex items-center justify-between px-4 pt-12 pb-2">
          <button
            onClick={() => navigate('/games')}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="text-white/60 text-xs font-medium tracking-widest uppercase">
            Il Cervello
          </span>

          <div className="w-9 h-9" />
        </div>
      </div>

      {/* 3D Viewer — fills most of the screen */}
      <div className="absolute inset-0 z-10">
        <AnimatePresence>
          {!modelLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-20"
              style={{ background: 'linear-gradient(180deg, #0a1628 0%, #12203a 100%)' }}
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4"
              >
                <span className="text-3xl">🧠</span>
              </motion.div>
              <p className="text-white/60 text-sm">Caricamento modello 3D...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {currentStepData && (
          <BrainViewer
            step={currentStepData}
            onLoad={handleModelLoad}
            onARStatus={(status) => {
              setARActive(status === 'session-started');
            }}
          />
        )}
      </div>

      {/* Narrative overlay — always on top */}
      {currentStepData && (
        <BrainStoryOverlay
          step={currentStepData}
          stepIndex={state.currentStep}
          totalSteps={totalSteps}
          isPlaying={state.isPlaying}
          onPrev={prevStep}
          onNext={nextStep}
          onTogglePlay={togglePlay}
        />
      )}
    </div>
  );
}
