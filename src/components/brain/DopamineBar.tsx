import { motion } from 'framer-motion';

interface DopamineBarProps {
  stepId: number;
}

const DOPAMINE_LEVELS: Record<number, { level: number; label: string; color: string }> = {
  3: { level: 65, label: 'Dopamina in rilascio', color: '#f59e0b' },
  4: { level: 85, label: 'Picco dopaminergico', color: '#ef4444' },
};

export default function DopamineBar({ stepId }: DopamineBarProps) {
  const config = DOPAMINE_LEVELS[stepId] ?? { level: 50, label: 'Dopamina', color: '#3b82f6' };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-white/80 text-xs font-medium tracking-wide uppercase">
          Livello Dopamina
        </span>
        <span className="text-white text-xs font-bold">{config.level}%</span>
      </div>
      <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: config.color }}
          initial={{ width: 0 }}
          animate={{ width: `${config.level}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      <span className="text-white/60 text-xs">{config.label}</span>
    </div>
  );
}
