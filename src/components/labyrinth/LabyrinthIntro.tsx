import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Smartphone, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';

interface LabyrinthIntroProps {
  onStart: () => void;
  onExit: () => void;
}

export default function LabyrinthIntro({ onStart, onExit }: LabyrinthIntroProps) {
  const [error, setError] = useState<string | null>(null);

  const requestPermissionAndStart = async () => {
    try {
      // Check if we need to request permission (iOS 13+)
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof (DeviceOrientationEvent as any).requestPermission === 'function'
      ) {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          onStart();
        } else {
          setError("Permesso per i sensori di movimento negato. Non è possibile giocare.");
        }
      } else {
        // Non-iOS 13+ devices or if HTTP is used locally without sensor API access
        onStart();
      }
    } catch (err) {
      console.warn("Error requesting device orientation permission:", err);
      // Fallback per PC / Dev locale HTTP - permettiamo l'avvio in modo che si possa giocare con le frecce
      onStart();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900 flex flex-col z-50 overflow-y-auto"
      style={{ background: 'linear-gradient(160deg, #0B2A57 0%, #1a1a2e 50%, #4195A4 100%)' }}
    >
      {/* Header */}
      <button
        onClick={onExit}
        className="absolute top-12 left-4 z-10 flex items-center gap-1.5 text-white/70 text-sm font-medium hover:text-white transition-colors"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Giochi
      </button>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-10 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="w-28 h-28 rounded-3xl flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 shadow-[0_0_40px_rgba(65,149,164,0.3)]">
            <Clock className="w-14 h-14 text-white" strokeWidth={1.2} />
          </div>
          <motion.div
            className="absolute -top-2 -right-2 w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center shadow-lg"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-4 h-4 text-teal-900" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-6"
        >
          <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-2">
            Mini-Gioco Sensoriale
          </p>
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
            Labyrinth
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-xs mx-auto">
            Guida la sfera nel labirinto inclinando il telefono. Alla fine, ti chiederemo di stimare il tempo trascorso.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {['Giroscopio', 'Percezione del Tempo', 'Procedurale'].map((label) => (
            <span
              key={label}
              className="text-white/80 text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 border border-white/20"
            >
              {label}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-10 max-w-xs w-full flex items-start gap-4 border border-white/20"
        >
          <Smartphone className="w-8 h-8 text-teal-400 flex-shrink-0" />
          <div className="text-left">
            <h3 className="text-white font-semibold mb-1">Uso dei Sensori</h3>
            <p className="text-white/70 text-xs">
              Questo gioco richiede l'accesso all'accelerometro per funzionare. Ti verrà richiesto di concedere i permessi.
            </p>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 text-red-200 border border-red-500/30 rounded-xl p-4 mb-6 max-w-sm flex items-start gap-3 text-left"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          onClick={requestPermissionAndStart}
          className="w-full max-w-xs flex items-center justify-center gap-3 bg-white text-slate-900 font-bold text-lg py-4 px-8 rounded-2xl shadow-2xl hover:bg-white/90 active:scale-95 transition-all"
        >
          <Clock className="w-5 h-5" />
          Inizia l'esperienza
        </motion.button>
      </div>
    </div>
  );
}
