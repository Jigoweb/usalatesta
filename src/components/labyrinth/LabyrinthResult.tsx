import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RotateCcw, Home } from 'lucide-react';

interface LabyrinthResultProps {
  realTimeMs: number;
  onRestart: () => void;
  onExit: () => void;
}

const DECALOGUE_TIPS = [
  "Non rincorrere le perdite. Quello che è perso è perso.",
  "Decidi prima quanto tempo vuoi giocare e imposta una sveglia.",
  "Non giocare quando sei triste, arrabbiato o stressato.",
  "Considera il gioco come un intrattenimento a pagamento, non come un modo per fare soldi.",
  "Fai delle pause frequenti per mantenere la lucidità.",
];

export default function LabyrinthResult({ realTimeMs, onRestart, onExit }: LabyrinthResultProps) {
  const [step, setStep] = useState<'distractor' | 'estimation' | 'result'>('distractor');
  const [estimatedTime, setEstimatedTime] = useState<number>(30); // Default middle value
  const [randomTip] = useState(() => DECALOGUE_TIPS[Math.floor(Math.random() * DECALOGUE_TIPS.length)]);

  const realTimeSeconds = Math.round(realTimeMs / 1000);
  const timeDifference = Math.abs(estimatedTime - realTimeSeconds);
  const isOverestimated = estimatedTime > realTimeSeconds;

  const getResultMessage = () => {
    // Se lo scostamento è entro i 9 secondi, consideriamo la stima positiva (Messaggio 1 e 2)
    if (timeDifference < 10) {
      // Alterniamo i messaggi positivi in base a un fattore casuale o semplicemente
      // ne scegliamo uno in base allo scostamento per variare (es. scostamento pari/dispari)
      if (timeDifference % 2 === 0) {
        return (
          <>
            <span className="block font-bold text-white mb-2">Hai stimato correttamente il tempo di gioco.</span>
            Essere consapevoli di quanto tempo passa è un buon segnale: mantenere il controllo aiuta a vivere il gioco come un'esperienza di puro divertimento.
          </>
        );
      } else {
        return (
          <>
            <span className="block font-bold text-white mb-2">Ottima percezione del tempo!</span>
            Riuscire a monitorare la durata del gioco è un aspetto importante di un approccio responsabile e consapevole.
          </>
        );
      }
    } 
    // Se lo scostamento è dai 10 secondi in su, consideriamo la stima sbagliata (Messaggio 3 e 4)
    else {
      // Se l'utente ha sovrastimato o sottostimato, possiamo variare il messaggio
      if (isOverestimated) {
        return (
          <>
            <span className="block font-bold text-white mb-2">La tua stima del tempo non era corretta.</span>
            Il coinvolgimento nel gioco può alterare la percezione della durata: fare pause regolari aiuta a giocare in modo più consapevole.
          </>
        );
      } else {
        return (
          <>
            <span className="block font-bold text-white mb-2">Il tempo è passato più velocemente di quanto pensassi.</span>
            Durante il gioco può capitare di perdere la percezione del tempo: fermarsi e riflettere aiuta a mantenere il controllo.
          </>
        );
      }
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEstimatedTime(parseInt(e.target.value, 10));
  };

  const handleNext = () => {
    if (step === 'distractor') setStep('estimation');
    else if (step === 'estimation') setStep('result');
  };

  return (
    <div 
      className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(160deg, #0B2A57 0%, #1a1a2e 50%, #4195A4 100%)' }}
    >
      <AnimatePresence mode="wait">
        
        {/* Step 1: Distractor (Tip from Decalogue) */}
        {step === 'distractor' && (
          <motion.div
            key="distractor"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
          >
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💡</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Consiglio del giorno</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              "{randomTip}"
            </p>
            <button
              onClick={handleNext}
              className="w-full bg-teal-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              Continua <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Step 2: Time Estimation */}
        {step === 'estimation' && (
          <motion.div
            key="estimation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Quanto tempo è passato?</h2>
            <p className="text-slate-500 mb-8">
              Mentre giocavi al labirinto, quanto tempo pensi sia trascorso?
            </p>

            <div className="mb-10">
              <div className="text-5xl font-black text-teal-500 mb-6">
                {estimatedTime} <span className="text-2xl text-teal-300">sec</span>
              </div>
              
              <input
                type="range"
                min="5"
                max="120"
                step="1"
                value={estimatedTime}
                onChange={handleSliderChange}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                <span>5s</span>
                <span>2 min</span>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-teal-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              Scopri la verità
            </button>
          </motion.div>
        )}

        {/* Step 3: Result & Comparison */}
        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">La Tua Percezione</h2>
              <p className="text-white/80">
                Il gioco altera il modo in cui viviamo il tempo. Guarda la differenza.
              </p>
            </div>

            {/* Comparison Chart */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-8 border border-white/20">
              <div className="space-y-6">
                {/* Real Time Bar */}
                <div>
                  <div className="flex justify-between text-sm text-white/70 mb-2">
                    <span>Tempo Reale</span>
                    <span className="font-bold text-white">{realTimeSeconds}s</span>
                  </div>
                  <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (realTimeSeconds / Math.max(realTimeSeconds, estimatedTime)) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-blue-400 rounded-full"
                    />
                  </div>
                </div>

                {/* Perceived Time Bar */}
                <div>
                  <div className="flex justify-between text-sm text-white/70 mb-2">
                    <span>La tua percezione</span>
                    <span className="font-bold text-white">{estimatedTime}s</span>
                  </div>
                  <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (estimatedTime / Math.max(realTimeSeconds, estimatedTime)) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-full bg-teal-400 rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Insight message */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-6 pt-6 border-t border-white/10"
              >
                <p className="text-white/90 text-sm leading-relaxed text-center font-medium">
                  {getResultMessage()}
                </p>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={onRestart}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl flex flex-col items-center gap-1 active:scale-95 transition-transform"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="text-xs font-semibold">Rigioca</span>
              </button>
              <button
                onClick={onExit}
                className="flex-1 bg-teal-500 text-white py-4 rounded-xl flex flex-col items-center gap-1 active:scale-95 transition-transform"
              >
                <Home className="w-5 h-5" />
                <span className="text-xs font-semibold">Torna ai Giochi</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
