import { Brain, Clock, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const games = [
  {
    id: 1,
    title: 'Il cervello',
    subtitle: 'Quando Giochi Come Funziona?',
    icon: Brain,
    gradient: 'linear-gradient(135deg, #0B2A57 0%, #9D2050 100%)',
    accentColor: 'rgba(157, 32, 80, 0.3)',
    delay: 0.1,
  },
  {
    id: 2,
    title: 'Labirinth',
    subtitle: 'Quanto Tempo è Passato?',
    icon: Clock,
    gradient: 'linear-gradient(135deg, #0B2A57 0%, #4195A4 100%)',
    accentColor: 'rgba(65, 149, 164, 0.3)',
    delay: 0.2,
  },
];

export default function Games() {
  return (
    <div className="bg-slate-50 pb-4">
      {/* Game Cards */}
      <div className="px-4 pt-6 space-y-5">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: game.delay, ease: 'easeOut' }}
              className="relative rounded-2xl overflow-hidden shadow-md group"
            >
              {/* Background */}
              <div
                className="absolute inset-0 z-0"
                style={{ background: game.gradient }}
              />

              {/* Decorative icon watermark */}
              <Icon
                className="absolute -right-4 -bottom-4 w-48 h-48 text-white/[0.06] z-0 pointer-events-none select-none"
                strokeWidth={0.8}
              />

              {/* Border overlay */}
              <div className="absolute inset-0 z-20 rounded-2xl border-2 border-white/20 pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 p-6 min-h-[180px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                    >
                      <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-xl leading-tight">
                        {game.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {game.subtitle}
                  </p>
                </div>

                {/* Coming soon badge */}
                <div className="mt-5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3.5 py-2 rounded-full border border-white/20">
                    <Lock className="w-3.5 h-3.5" />
                    Presto disponibile
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="px-4 mt-8"
      >
        <div className="bg-primary-blue/5 border-l-4 border-primary-blue rounded-r-xl p-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            Nuovi giochi interattivi saranno disponibili a breve per aiutarti a comprendere meglio i meccanismi del gioco responsabile.
          </p>
        </div>
      </motion.div>
    </div>
  );
}