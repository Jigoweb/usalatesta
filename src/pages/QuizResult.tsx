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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-8">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary-blue mb-2">Il tuo risultato</h1>
        <p className="text-gray-500 mb-12">CPGI / PGSI Score</p>

        <div className={`w-48 h-48 rounded-full flex flex-col items-center justify-center ${result.color} text-white shadow-xl mb-8 transform transition-all animate-pulse`}>
          <span className="text-6xl font-black">{score}</span>
          <span className="text-sm font-medium opacity-80">/ 27</span>
        </div>

        <div className="text-center space-y-4 mb-12">
          <h2 className={`text-2xl font-bold ${result.color.replace('bg-', 'text-')}`}>
            {result.label}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {result.level === 'none' && "Ottimo! Il tuo approccio al gioco sembra essere sano e responsabile. Continua così."}
            {result.level === 'low' && "Attenzione. Potresti essere a rischio basso. Tieni d'occhio le tue abitudini di gioco."}
            {result.level === 'moderate' && "Il tuo punteggio indica un rischio moderato. Ti consigliamo di leggere il decalogo e considerare di limitare il gioco."}
            {result.level === 'problematic' && "Il tuo punteggio indica un possibile problema con il gioco. Non esitare a chiedere supporto."}
          </p>
        </div>

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