import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { QUIZ_QUESTIONS, SCORING } from '../data/quiz';
import { QuizAnswer } from '../types';
import quizImg from '../assets/images/usa-la-testa_quizimg.PNG';

export default function Quiz() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const handleAnswer = (value: 0 | 1 | 2 | 3) => {
    setDirection(value > 1 ? 1 : -1); // Positive answers slide right, negative left
    
    setTimeout(() => {
      const newAnswers = [...answers];
      const existingIndex = newAnswers.findIndex(a => a.questionId === QUIZ_QUESTIONS[currentIndex].id);
      
      if (existingIndex >= 0) {
        newAnswers[existingIndex] = { questionId: QUIZ_QUESTIONS[currentIndex].id, value };
      } else {
        newAnswers.push({ questionId: QUIZ_QUESTIONS[currentIndex].id, value });
      }
      
      setAnswers(newAnswers);

      if (isEditing) {
        setShowSummary(true);
        setIsEditing(false);
        setDirection(0);
      } else if (currentIndex < QUIZ_QUESTIONS.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setDirection(0);
      } else {
        setShowSummary(true);
      }
    }, 200);
  };

  const handleSubmit = () => {
    const totalScore = answers.reduce((acc, curr) => acc + curr.value, 0);
    // In a real app, save to context or local storage
    localStorage.setItem('usalatesta_last_quiz_score', totalScore.toString());
    navigate('/quiz/result');
  };

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];

  if (showSummary) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 pb-24">
        <div className="flex items-center mb-6">
          <button onClick={() => setShowSummary(false)} className="mr-4">
            <ChevronLeft className="text-primary-blue" />
          </button>
          <h1 className="text-2xl font-bold text-primary-blue">Riepilogo</h1>
        </div>

        <div className="space-y-4 mb-8">
          {QUIZ_QUESTIONS.map((q) => {
            const answer = answers.find(a => a.questionId === q.id);
            return (
              <div key={q.id} className="bg-white p-4 rounded-xl shadow-sm">
                <p className="font-medium text-gray-800 mb-2">{q.text}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">La tua risposta:</span>
                  <span className="font-bold text-primary-blue">
                    {SCORING[answer?.value as keyof typeof SCORING]}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setCurrentIndex(QUIZ_QUESTIONS.indexOf(q));
                    setShowSummary(false);
                    setIsEditing(true);
                  }}
                  className="text-xs text-blue-400 mt-2 underline"
                >
                  Modifica
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-primary-blue text-white font-bold rounded-xl shadow-lg hover:bg-blue-900 transition-colors"
        >
          Invia Risposte
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center bg-white sticky top-0 z-50 shadow-sm">
        <button onClick={() => navigate('/home')} className="mr-4">
          <ChevronLeft className="text-primary-blue" />
        </button>
        <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary-blue h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>
        <span className="ml-4 text-sm font-bold text-primary-blue">
          {currentIndex + 1}/{QUIZ_QUESTIONS.length}
        </span>
      </div>

      {/* Card Area */}
      <div className="flex-1 flex flex-col justify-start items-center p-6 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 300, opacity: 0, rotate: 10 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ 
              x: direction * -300, 
              opacity: 0, 
              rotate: direction * -20 
            }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full max-w-sm"
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
              <div className="h-48 bg-blue-100 relative">
                <img 
                  src={quizImg} 
                  alt="Question illustration" 
                  className="w-full h-full object-cover mix-blend-multiply opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
              </div>
              
              <div className="p-8">
                <h2 className="text-base font-normal text-gray-800 leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-24 left-0 w-full px-6 flex justify-center z-10">
          <div className="w-full max-w-sm space-y-3">
            {(Object.entries(SCORING) as [string, string][]).reverse().map(([value, label]) => (
              <button
                key={value}
                onClick={() => handleAnswer(Number(value) as 0|1|2|3)}
                className={`w-full py-4 px-6 rounded-2xl border-2 font-bold text-center transition-all shadow-sm
                  ${Number(value) === 0 ? 'border-white bg-white text-primary-blue hover:bg-gray-50' : ''}
                  ${Number(value) === 1 ? 'border-white bg-white text-primary-blue hover:bg-gray-50' : ''}
                  ${Number(value) === 2 ? 'border-white bg-white text-primary-blue hover:bg-gray-50' : ''}
                  ${Number(value) === 3 ? 'border-white bg-white text-primary-blue hover:bg-gray-50' : ''}
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
