import { motion } from 'framer-motion';

interface DopamineBarProps {
  level: 'bassa' | 'media' | 'alta';
}

const LEVEL_CONFIG = {
  bassa: {
    pct: 28,
    color: '#4195A4',
    glow: 'rgba(65,149,164,0.45)',
  },
  media: {
    pct: 62,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.45)',
  },
  alta: {
    pct: 92,
    color: '#e02020',
    glow: 'rgba(220,32,32,0.55)',
  },
} as const;

export default function DopamineBar({ level }: DopamineBarProps) {
  const cfg = LEVEL_CONFIG[level];

  return (
    <div className="flex flex-col gap-1 pb-2">
      <span className="text-white/60 text-[10px] font-semibold tracking-widest uppercase">
        Livello Dopamina
      </span>

      {/* Track */}
      <div className="relative w-full h-3 bg-white/15 rounded-full overflow-visible mt-1">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: cfg.color, boxShadow: `0 0 10px ${cfg.glow}` }}
          initial={{ width: 0 }}
          animate={{ width: `${cfg.pct}%` }}
          transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
        />
        {/* Pulse dot at tip — wrapper handles centering, inner div handles scale */}
        <div
          className="absolute top-0 bottom-0 flex items-center"
          style={{ left: `calc(${cfg.pct}% - 7px)` }}
        >
          <motion.div
            className="w-3.5 h-3.5 rounded-full border-2 border-white/80"
            style={{ backgroundColor: cfg.color }}
            animate={{ scale: [1, 1.35, 1], opacity: [1, 0.55, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
          />
        </div>
      </div>
    </div>
  );
}
