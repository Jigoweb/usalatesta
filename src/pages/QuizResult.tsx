import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRiskLevel } from '../data/quiz';
import { Home, Phone } from 'lucide-react';

export default function QuizResult() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<ReturnType<typeof getRiskLevel>>({ level: 'none', label: '', color: '' });

  useEffect(() => {
    const savedScore = localStorage.getItem('usalatesta_last_quiz_score');
    if (savedScore) {
      const scoreNum = parseInt(savedScore);
      setScore(scoreNum);
      setResult(getRiskLevel(scoreNum));
    } else {
      navigate('/quiz');
    }
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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-8 pb-24">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary-blue mb-2">Il tuo risultato</h1>
        <p className="text-gray-500 mb-12">CPGI / PGSI Score</p>

        <div className={`w-48 h-48 rounded-full flex flex-col items-center justify-center ${result.color} text-white shadow-xl mb-8 transform transition-all animate-pulse`}>
          <span className="text-6xl font-black">{score}</span>
          <span className="text-sm font-medium opacity-80">/ 27</span>
        </div>

        <div className="text-center space-y-4 mb-8">
          <h2 className={`text-2xl font-bold ${result.color.replace('bg-', 'text-')}`}>
            {result.label}
          </h2>
          <p className="text-gray-800 font-medium leading-relaxed">{msg.title}</p>
          <p className="text-gray-600 leading-relaxed">{msg.text}</p>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed text-center mb-8">
          Ricorda che una diagnosi di questo tipo può essere effettuata solo da uno psicoterapeuta preparato. Questo test è uno strumento di auto diagnosi, che può comunque fornirti un&apos;utile indicazione per verificare se hai o meno problemi con il gioco d&apos;azzardo.
        </p>
        <p className="text-gray-400 text-xs mb-12">Fonte Test: Problem Gambling Severity Index (PGSI)</p>

        {result.level === 'problematic' || result.level === 'moderate' ? (
          <button
            onClick={() => navigate('/support')}
            className="w-full py-4 bg-secondary-orange text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 transition-colors flex items-center justify-center mb-4"
          >
            <Phone className="mr-2" />
            Richiedi Supporto
          </button>
        ) : null}
        
        <button
          onClick={() => navigate('/home')}
          className="w-full py-4 border-2 border-primary-blue text-primary-blue font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center"
        >
          <Home className="mr-2" />
          Torna alla Home
        </button>
      </div>
    </div>
  );
}