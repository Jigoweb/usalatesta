import { motion } from 'framer-motion';
import { Brain, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BrainIntroProps {
  onStart: () => void;
}

export default function BrainIntro({ onStart }: BrainIntroProps) {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0B2A57 0%, #1a1a2e 50%, #9D2050 100%)' }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate('/games')}
        className="absolute top-12 left-4 z-10 flex items-center gap-1.5 text-white/70 text-sm font-medium hover:text-white transition-colors"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Giochi
      </button>

      {/* Stars decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-10">
        {/* Brain icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
          className="relative mb-8"
        >
          <div className="w-28 h-28 rounded-3xl flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
            <Brain className="w-14 h-14 text-white" strokeWidth={1.2} />
          </div>
          <motion.div
            className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-4 h-4 text-yellow-900" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-6"
        >
          <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-2">
            Esperienza AR
          </p>
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
            Il Cervello
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-xs">
            Scopri come funziona il tuo cervello quando giochi e come la dopamina
            influenza le tue decisioni.
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {['7 step interattivi', 'Modello 3D', 'Realtà Aumentata'].map((label) => (
            <span
              key={label}
              className="text-white/80 text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 border border-white/20"
            >
              {label}
            </span>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          onClick={onStart}
          className="w-full max-w-xs flex items-center justify-center gap-3 bg-white text-slate-900 font-bold text-lg py-4 px-8 rounded-2xl shadow-2xl hover:bg-white/90 active:scale-95 transition-all"
        >
          <Brain className="w-5 h-5" />
          Inizia l'esperienza
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-white/40 text-xs mt-6 text-center max-w-xs"
        >
          Il modello 3D viene caricato all'avvio. Per la modalità AR è necessaria
          la connessione internet.
        </motion.p>
      </div>
    </div>
  );
}
