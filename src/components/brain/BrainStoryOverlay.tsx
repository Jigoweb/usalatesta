import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Dna, Heart, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
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
  house: Home,
  heart: Heart,
};

const ICON_LABELS = {
  dna: 'Genetica',
  house: 'Ambiente',
  heart: 'Stress',
};

const ICON_POSITIONS: Record<string, { top?: string, bottom?: string, left?: string, right?: string, delay: number }> = {
  dna: { top: '15%', left: '10%', delay: 0.2 },
  house: { top: '45%', right: '12%', delay: 0.4 },
  heart: { bottom: '40%', left: '15%', delay: 0.6 },
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

  // Animazione testo lettera per lettera
  const words = step.text.split(' ');

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none h-full">
      {/* Risk icons overlay (step 9) */}
      <AnimatePresence>
        {step.overlay?.icons && (
          <motion.div
            key="icons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {step.overlay.icons.map((icon) => {
              const Icon = ICON_MAP[icon as keyof typeof ICON_MAP];
              const label = ICON_LABELS[icon as keyof typeof ICON_LABELS];
              const pos = ICON_POSITIONS[icon];
              return (
                <motion.div
                  key={icon}
                  className="absolute flex flex-col items-center gap-1.5"
                  style={{ top: pos.top, bottom: pos.bottom, left: pos.left, right: pos.right }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: pos.delay }}
                >
                  <motion.div 
                    className="w-14 h-14 flex items-center justify-center drop-shadow-lg"
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: pos.delay }}
                  >
                    <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                  </motion.div>
                  <span className="text-white/80 text-sm font-semibold drop-shadow-md">{label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main narrative panel */}
      <motion.div
        className="absolute bottom-3 inset-x-3 rounded-2xl overflow-hidden pointer-events-auto"
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
              className="flex flex-col max-h-[160px]"
            >
              <h2 className="text-white font-bold text-lg leading-tight mb-2 shrink-0">
                {step.title}
              </h2>
              <div className="overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-white/75 text-sm leading-relaxed pb-2">
                  {words.map((word, i) => (
                    <motion.span
                      key={`${step.id}-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, delay: i * 0.05 }}
                    >
                      {word}{' '}
                    </motion.span>
                  ))}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dopamine bar — shown only when a level is explicitly set in the step */}
          <AnimatePresence>
            {step.overlay?.dopamineLevel && (
              <motion.div
                key={`dopamine-${step.id}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-3 overflow-hidden"
              >
                <DopamineBar level={step.overlay.dopamineLevel} />
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
