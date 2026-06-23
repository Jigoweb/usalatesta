import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { getRiskLevel } from '../data/quiz';
import { Home, Phone } from 'lucide-react';
import { useIsEmbed } from '../hooks/useIsEmbed';

export default function QuizResult() {
  const navigate = useNavigate();
  const { isEmbed } = useIsEmbed();
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<ReturnType<typeof getRiskLevel>>({ level: 'none', label: '', color: '', textColor: '' });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset scroll position immediately, before paint
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const savedScore = localStorage.getItem('usalatesta_last_quiz_score');
    if (savedScore) {
      const scoreNum = parseInt(savedScore);
      setScore(scoreNum);
      setResult(getRiskLevel(scoreNum));
    } else {
      navigate(`/quiz${isEmbed ? '?embed=true' : ''}`);
    }
    
    // Also reset scroll after a short delay to ensure it works
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [navigate]);

  const resultMessages = {
    none: {
      title: 'Ottimo!',
      text: "Dal tuo test non emergono segnali di rischio. Continua a vivere il gioco per quello che dovrebbe essere: un momento leggero di divertimento e svago. Siamo sempre qui per accompagnarti a giocare in modo consapevole.",
    },
    low: {
      title: 'Va tutto bene, ma un pizzico di attenzione in più non guasta.',
      text: "Il tuo risultato indica un rischio molto basso, ma essere consapevoli delle proprie abitudini è il modo migliore per continuare a giocare in serenità. Se vuoi, puoi esplorare i nostri consigli per mantenere un rapporto sano con il gioco.",
    },
    moderate: {
      title: 'Il test suggerisce qualche segnale da non trascurare.',
      text: "Non significa che ci sia un problema, ma può essere utile fermarsi un momento e riflettere sulle proprie abitudini di gioco. Siamo qui per aiutarti: nell'app trovi strumenti, suggerimenti e contenuti utili per ritrovare equilibrio e leggerezza.",
    },
    problematic: {
      title: 'Il tuo test indica che potresti essere in una fase delicata.',
      text: "Riconoscere la situazione è un passo importante, e non sei solo: l'app mette a tua disposizione risorse e contatti che possono supportarti concretamente. Rivolgerti a un servizio specializzato può aiutarti a ritrovare serenità e controllo. Siamo qui per accompagnarti, sempre.",
    },
  };

  const msg = resultMessages[result.level];

  // Gradient styles for score circle based on risk level
  const getScoreCircleStyle = () => {
    switch (result.level) {
      case 'none':
        return { background: 'linear-gradient(135deg, #6AAB46 0%, #84BDE5 100%)' };
      case 'low':
        return { background: 'linear-gradient(135deg, #ECAA45 0%, #84BDE5 100%)' };
      case 'moderate':
        return { background: 'linear-gradient(135deg, #DA642C 0%, #ECAA45 100%)' };
      case 'problematic':
        return { background: 'linear-gradient(135deg, #9D2050 0%, #DA642C 100%)' };
      default:
        return { background: 'linear-gradient(135deg, #0B2A57 0%, #65ADDE 100%)' };
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      {!isEmbed && (
        <div className="p-4 flex items-center bg-white shadow-sm sticky top-0 z-50">
          <button onClick={() => navigate('/quiz')} className="mr-4">
            <ChevronLeft className="text-primary-blue" />
          </button>
        </div>
      )}

      {/* Content Container */}
      <div className="px-4 pt-8 pb-8 max-w-2xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-primary-blue mb-2">Il tuo risultato</h1>
          <p className="text-sm text-gray-500 font-medium">CPGI / PGSI Score</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* Score Circle */}
            <div 
              className="w-40 h-40 rounded-full flex flex-col items-center justify-center text-white shadow-lg mb-6 transform transition-transform hover:scale-105 relative overflow-hidden"
              style={getScoreCircleStyle()}
            >
              <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
              <span className="text-5xl font-black relative z-10">{score}</span>
              <span className="text-sm font-medium opacity-90 relative z-10">/ 27</span>
            </div>

            {/* Risk Level Label */}
            <h2 className={`text-2xl font-bold ${result.textColor} mb-6`}>
              {result.label}
            </h2>
          </div>
        </div>

        {/* Message Section */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {msg.title}
          </h3>
          <p className="text-gray-700 text-base leading-relaxed">
            {msg.text}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-primary-blue/5 border-2 border-gray-200 rounded-2xl p-5 mb-8">
          <p className="text-gray-700 text-sm leading-relaxed">
            Ricorda che una diagnosi di questo tipo può essere effettuata solo da uno psicoterapeuta preparato. Questo test è uno strumento di auto diagnosi, che può comunque fornirti un&apos;utile indicazione per verificare se hai o meno problemi con il gioco d&apos;azzardo.
          </p>
        </div>

        {/* Source */}
        <p className="text-gray-400 text-xs text-center mb-8">
          Fonte Test: Problem Gambling Severity Index (PGSI)
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {result.level === 'problematic' || result.level === 'moderate' ? (
            isEmbed ? (
              <a
                href="https://usa-la-testa.it/support"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-primary-blue text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center"
              >
                <Phone className="mr-2" size={20} />
                Richiedi Supporto
              </a>
            ) : (
              <button
                onClick={() => navigate('/support')}
                className="w-full py-4 bg-primary-blue text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center"
              >
                <Phone className="mr-2" size={20} />
                Richiedi Supporto
              </button>
            )
          ) : null}
          
          {isEmbed ? (
            <a
              href="https://usa-la-testa.it"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 border-2 border-primary-blue text-primary-blue font-bold rounded-xl hover:bg-primary-blue/5 transition-colors flex items-center justify-center"
            >
              <Home className="mr-2" size={20} />
              Vai al sito web
            </a>
          ) : (
            <button
              onClick={() => navigate('/home')}
              className="w-full py-4 border-2 border-primary-blue text-primary-blue font-bold rounded-xl hover:bg-primary-blue/5 transition-colors flex items-center justify-center"
            >
              <Home className="mr-2" size={20} />
              Torna alla Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}