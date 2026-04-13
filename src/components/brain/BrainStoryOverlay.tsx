import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Dna, Heart, Home } from 'lucide-react';
import type { BrainStoryStep } from '../../types/brain';
import DopamineBar from './DopamineBar';

interface BrainStoryOverlayProps {
  step: BrainStoryStep;
  stepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
}

const ICON_MAP = {
  dna: Dna,
  heart: Heart,
  house: Home,
};

const ICON_LABELS = {
  dna: 'Genetica',
  heart: 'Ambiente',
  house: 'Stress',
};

export default function BrainStoryOverlay({
  step,
  stepIndex,
  totalSteps,
  isPlaying,
  onPrev,
  onNext,
  onTogglePlay,
}: BrainStoryOverlayProps) {
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">
      {/* Risk icons overlay (step 5) */}
      <AnimatePresence>
        {step.overlay?.icons && (
          <motion.div
            key="icons"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center gap-6 mb-4 pointer-events-none"
          >
            {step.overlay.icons.map((icon) => {
              const Icon = ICON_MAP[icon];
              const label = ICON_LABELS[icon];
              return (
                <motion.div
                  key={icon}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <span className="text-white/80 text-xs font-medium">{label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main narrative panel */}
      <motion.div
        className="mx-3 mb-3 rounded-2xl overflow-hidden pointer-events-auto"
        style={{
          background: 'rgba(11, 42, 87, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {/* Progress bar */}
        <div className="flex gap-1 px-4 pt-3">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/20"
            >
              {i < stepIndex ? (
                <div className="h-full bg-white/70 w-full" />
              ) : i === stepIndex ? (
                <motion.div
                  key={`progress-${stepIndex}`}
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: isPlaying ? '100%' : '30%' }}
                  transition={
                    isPlaying ? { duration: step.duration, ease: 'linear' } : { duration: 0.3 }
                  }
                />
              ) : null}
            </div>
          ))}
        </div>

        <div className="px-4 pt-3 pb-4">
          {/* Step label */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-xs font-medium tracking-widest uppercase">
              Step {stepIndex + 1} / {totalSteps}
            </span>
          </div>

          {/* Title + Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="text-white font-bold text-lg leading-tight mb-2">
                {step.title}
              </h2>
              <p className="text-white/75 text-sm leading-relaxed line-clamp-4">
                {step.text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dopamine bar */}
          <AnimatePresence>
            {step.overlay?.dopamineBar && (
              <motion.div
                key="dopamine"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <DopamineBar stepId={step.id} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={onPrev}
              disabled={isFirst}
              className="flex items-center gap-1 text-white/60 text-sm font-medium disabled:opacity-30 hover:text-white transition-colors py-2 pr-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Indietro
            </button>

            <button
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center hover:bg-white/25 transition-colors active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="flex items-center gap-1 text-white text-sm font-semibold hover:text-white/80 transition-colors py-2 pl-2"
            >
              {isLast ? 'Concludi' : 'Avanti'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
