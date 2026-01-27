import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import logoWhite from '../assets/images/usa-la-testa_logo-white.png';
import { ARTICLES } from '../data/articles';

// Import images
import quizImg from '../assets/images/usa-la-testa_quizimg.PNG';
import decalogoImg from '../assets/images/usa-la-testa_decalogo.png';
import supportoImg from '../assets/images/usa-la-testa_supporto.png';
import aComponentImg from '../assets/images/a_component.png';

// Mock data for tips
const TIPS = [
  { id: 1, text: "Prima di giocare definisci una somma fissa e un tempo determinato", color: "from-purple-600 to-blue-600" },
  { id: 2, text: "Non giocare mai con denaro ricavato in prestito o destinato ad altri scopi", color: "from-orange-500 to-red-500" },
  { id: 3, text: "Gioca per divertirti e non pensare al gioco come una fonte di reddito", color: "from-blue-500 to-cyan-500" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-[#0c2c4a] rounded-b-[2rem] px-4 pt-4 pb-8 shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <img src={logoWhite} alt="USA LA TESTA" className="h-10 object-contain" />
        </div>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-2 gap-4 relative z-10">
          {/* Quiz Card - Full Width */}
          <div 
            onClick={() => navigate('/quiz')}
            className="col-span-2 bg-gradient-to-r from-[#c53a7b] via-[#2b3d78] to-[#2aa2c6] rounded-2xl p-4 relative overflow-hidden h-32 cursor-pointer shadow-md group border-2 border-white/30 hover:border-white/60 transition-colors"
          >
            <div className="relative z-10 w-2/3">
              <h2 className="text-white font-bold text-xl mb-1">Quiz di autovalutazione</h2>
              <p className="text-blue-100 text-xs">Approfondisci il tuo rapporto col gioco</p>
            </div>
            <img 
              src={quizImg} 
              alt="Quiz" 
              className="absolute right-0 top-0 h-full w-1/2 object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Decalogo Card */}
          <div 
            onClick={() => navigate('/decalogo')}
            className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-4 relative overflow-hidden h-40 cursor-pointer shadow-md group border-2 border-white/30 hover:border-white/60 transition-colors"
          >
            <div className="relative z-10">
              <h3 className="text-white font-bold text-lg leading-tight">Il decalogo del giocatore</h3>
            </div>
            <img 
              src={decalogoImg} 
              alt="Decalogo" 
              className="absolute bottom-0 right-0 w-24 h-24 object-contain translate-x-2 translate-y-2 group-hover:scale-105 transition-transform"
            />
            {/* Background 'A' Element */}
            <img 
              src={aComponentImg} 
              alt="" 
              className="absolute -left-10 -bottom-10 h-[120%] w-auto object-contain pointer-events-none z-0 opacity-20 select-none mix-blend-overlay"
            />
            {/* Soft triangular gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10 pointer-events-none"></div>
          </div>

          {/* Supporto Card */}
          <div 
            onClick={() => navigate('/support')}
            className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-4 relative overflow-hidden h-40 cursor-pointer shadow-md group border-2 border-white/30 hover:border-white/60 transition-colors"
          >
            <div className="relative z-10">
              <h3 className="text-white font-bold text-lg leading-tight">Supporto e informazioni utili</h3>
            </div>
            <img 
              src={supportoImg} 
              alt="Supporto" 
              className="absolute bottom-0 right-0 w-24 h-24 object-contain translate-x-2 translate-y-2 group-hover:scale-105 transition-transform"
            />
            {/* Background 'A' Element */}
            <img 
              src={aComponentImg} 
              alt="" 
              className="absolute -left-10 -bottom-10 h-[120%] w-auto object-contain pointer-events-none z-0 opacity-20 select-none mix-blend-overlay"
            />
            {/* Soft triangular gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-transparent to-white/10 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="mt-6 pl-4">
        <div className="flex justify-between items-center pr-4 mb-4">
          <h2 className="text-xl font-bold text-primary-blue">Articoli</h2>
          <button 
            onClick={() => navigate('/articles')}
            className="text-sm text-gray-500 flex items-center hover:text-primary-blue"
          >
            Leggi tutti <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="flex overflow-x-auto space-x-4 pb-4 pr-4 scrollbar-hide">
          {ARTICLES.map((article) => (
            <div 
              key={article.id}
              className="min-w-[200px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="h-28 overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm text-gray-800 line-clamp-2">{article.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-2 px-4 pb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary-blue mb-2">I nostri consigli</h2>
          <p className="text-gray-600 text-sm">
            Affinché il gioco rimanga un GIOCO, presta attenzione ai seguenti suggerimenti:
          </p>
        </div>

        <div className="space-y-4">
          {TIPS.map((tip, index) => (
            <div 
              key={tip.id}
              className={`bg-gradient-to-br ${tip.color} rounded-2xl p-6 relative overflow-hidden shadow-md transform transition-transform hover:-translate-y-1`}
            >
              <p className="text-white font-bold text-xl pr-8 relative z-10">
                {tip.text}
              </p>
              <span className="absolute bottom-[-20px] right-[-10px] text-8xl font-black text-white opacity-10">
                0{index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}