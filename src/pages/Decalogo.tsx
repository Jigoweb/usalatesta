import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const RULES = [
  "Al centro della mia vita non c’è solo il gioco d’azzardo. Non dimentico di coltivare i miei interessi e di dedicare tempo ai miei familiari e amici.",
  "Non spenderò ulteriori soldi con la speranza di riottenere quelli persi. Nel gioco è importante saper accettare di perdere.",
  "Se accetto di perdere, infatti, non corro il rischio di spendere altri soldi o di dover richiedere un prestito.",
  "Sarò sempre sincero con me stesso e con i miei cari riguardo sia le somme investite nel gioco, sia riguardo le perdite.",
  "Il gioco è solo uno svago, non una via di fuga. Non gioco perché mi sento depresso, teso o solo.",
  "Assumere qualsiasi tipo di droga o alcol, prima o durante il gioco, può compromettere la mia reale percezione di gioco.",
  "Prima di iniziare a giocare, decido quanto tempo voler destinare al gioco. E tengo a mente di fare delle pause tra una partita e l’altra.",
  "I miei pensieri non ruotano unicamente intorno al gioco d’azzardo. Durante la mia giornata ho molte cose a cui pensare e diverse attività da svolgere.",
  "Prima di iniziare a giocare, ho già deciso il limite di spesa. Non utilizzo denaro necessario a me e alla mia famiglia nel gioco d’azzardo.",
  "Il gioco è regolato dalla fortuna, non esistono strategie per prevedere i risultati."
];

export default function Decalogo() {
  const navigate = useNavigate();
  const [showQuizIntro, setShowQuizIntro] = useState(false);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="p-4 flex items-center border-b border-gray-100 sticky top-0 bg-white z-50">
        <button onClick={() => navigate('/home')} className="mr-2">
          <ChevronLeft className="text-primary-blue" />
        </button>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-blue mb-8">
          Il decalogo del giocatore
        </h1>

        <div className="space-y-6">
          {RULES.map((rule, index) => (
            <div key={index} className="relative py-4 min-h-[100px] flex items-center">
              <span className="absolute -left-4 text-[100px] font-black text-gray-200/50 -z-0 select-none pointer-events-none leading-none top-0">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <p className="text-gray-800 leading-relaxed font-medium relative z-10 pl-8">
                {rule}
              </p>
            </div>
          ))}
        </div>

        <p className="text-gray-700 leading-relaxed mt-8 mb-4">
          Se senti che alcuni di questi comportamenti ti rispecchiano, puoi fare un breve test anonimo di autovalutazione per comprendere meglio il tuo rapporto con il gioco.
        </p>
        <button
          onClick={() => { trackEvent('test_tap'); setShowQuizIntro(true); }}
          className="w-full py-4 bg-primary-blue text-white font-bold rounded-xl shadow-lg hover:bg-blue-900 transition-colors"
        >
          Vai al test
        </button>
      </div>

      {showQuizIntro && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 max-w-md shadow-xl">
            <p className="text-gray-800 font-medium text-base leading-relaxed mb-4">
              Il gioco può creare dipendenza e danneggiare seriamente anche la sfera personale.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Compila anonimamente un breve test utile per comprendere meglio il tuo rapporto con il gioco.
            </p>
            <button
              onClick={() => { trackEvent('test_start'); navigate('/quiz'); }}
              className="w-full py-4 bg-primary-blue text-white font-bold rounded-xl shadow-lg hover:bg-blue-900 transition-colors"
            >
              Inizia il test
            </button>
            <button
              onClick={() => setShowQuizIntro(false)}
              className="w-full py-3 mt-2 text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors"
            >
              Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}