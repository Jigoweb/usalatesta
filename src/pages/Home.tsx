import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import logoWhite from '../assets/images/usa-la-testa_logo-white.png';
import { ARTICLES } from '../data/articles';
import { TIPS } from '../data/tips';
import { HomeArticleSkeleton } from '../components/ArticleSkeletons';
import { ImageWithSkeleton } from '../components/ImageWithSkeleton';

// Import images
import quizImg from '../assets/images/usa-la-testa_quizimg.PNG';
import decalogoImg from '../assets/images/usa-la-testa_decalogo.png';
import supportoImg from '../assets/images/usa-la-testa_supporto.png';
import aComponentImg from '../assets/images/a_component.png';
import loghiBalduzzi from '../assets/images/loghi-balduzzi.png';

export default function Home() {
  const navigate = useNavigate();
  const [tipsMinHeight, setTipsMinHeight] = useState<number>(0);
  const [showQuizIntro, setShowQuizIntro] = useState(false);
  const tipRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const measure = () => {
      const heights = tipRefs.current.filter(Boolean).map(el => (el as HTMLDivElement).scrollHeight);
      if (heights.length) {
        const max = Math.max(...heights);
        setTipsMinHeight(max);
      }
    };
    measure();
    const onResize = () => {
      measure();
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const [wpArticles, setWpArticles] = useState<any[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const load = async () => {
      try {
        const res = await fetch('https://www.usa-la-testa.it/wp-json/wp/v2/posts?_embed&per_page=4', {
          signal: controller.signal
        });
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        const mapped = data.map((p: any) => {
          const media = p._embedded?.['wp:featuredmedia']?.[0];
          // Ottimizzazione: usa medium_large o medium se disponibili per alleggerire il peso, altrimenti l'originale
          const optimizedImage = media?.media_details?.sizes?.medium_large?.source_url 
                              || media?.media_details?.sizes?.medium?.source_url 
                              || media?.source_url 
                              || '';
          return {
            id: String(p.id),
            title: p.title?.rendered || '',
            image: optimizedImage,
          };
        });
        setWpArticles(mapped);
        setStatus('success');
      } catch (err) {
        setWpArticles(ARTICLES);
        setStatus('error');
      } finally {
        clearTimeout(timeoutId);
      }
    };
    
    // Defer the fetch to allow the main thread to render the UI first
    const deferId = setTimeout(() => {
      load();
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
      clearTimeout(deferId);
    };
  }, []);

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
            onClick={() => setShowQuizIntro(true)}
            className="col-span-2 rounded-2xl relative overflow-hidden h-32 cursor-pointer shadow-md group transition-transform hover:scale-[1.01]"
          >
            {/* Background Layer */}
            <div 
              className="absolute inset-0 z-0"
              style={{
                background: 'linear-gradient(105deg, #0B2A57 55%, #B14D73 100%)'
              }}
            />
            
            {/* Border Layer (Pseudo-border) */}
            <div className="absolute inset-0 z-20 rounded-2xl border-2 border-white/30 group-hover:border-white/60 transition-colors pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 p-4 h-full w-full">
              <div className="relative z-10 w-2/3">
                <h2 className="text-white font-bold text-xl mb-1">Test di autovalutazione</h2>
                <p className="text-blue-100 text-xs">Approfondisci il tuo rapporto col gioco</p>
              </div>
              <img 
                src={quizImg} 
                alt="Quiz" 
                className="absolute right-0 top-4 h-full w-1/2 translate-x-6 object-contain object-center opacity-90 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Decalogo Card */}
          <div 
            onClick={() => navigate('/decalogo')}
            className="rounded-2xl relative overflow-hidden h-40 cursor-pointer shadow-md group transition-transform hover:scale-[1.01]"
          >
            {/* Background Layer */}
            <div 
              className="absolute inset-0 z-0"
              style={{
                background: 'linear-gradient(180deg, #0B2A57 30%, #84BDE5 100%)'
              }}
            />
            
            {/* Border Layer */}
            <div className="absolute inset-0 z-20 rounded-2xl border-2 border-white/30 group-hover:border-white/60 transition-colors pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 p-4 h-full w-full">
              <div className="relative z-10">
                <h3 className="text-white font-bold text-lg leading-tight">Il decalogo del giocatore</h3>
              </div>
              {/* Background 'A' Element */}
              <img 
                src={aComponentImg} 
                alt="" 
                className="absolute -left-0 -bottom-0 h-[80%] w-auto object-contain pointer-events-none z-0 opacity-20 select-none mix-blend-overlay"
              />
              <img 
                src={decalogoImg} 
                alt="Decalogo" 
                className="absolute bottom-0 right-0 w-36 h-36 object-contain translate-x-6 translate-y-6 group-hover:scale-105 transition-transform"
              />
              {/* Soft triangular gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10 pointer-events-none"></div>
            </div>
          </div>

          {/* Supporto Card */}
          <div 
            onClick={() => navigate('/support')}
            className="rounded-2xl relative overflow-hidden h-40 cursor-pointer shadow-md group transition-transform hover:scale-[1.01]"
          >
            {/* Background Layer */}
            <div 
              className="absolute inset-0 z-0"
              style={{
                background: 'linear-gradient(180deg, #0B2A57 30%, #A6CD90 100%)'
              }}
            />
            
            {/* Border Layer */}
            <div className="absolute inset-0 z-20 rounded-2xl border-2 border-white/30 group-hover:border-white/60 transition-colors pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 p-4 h-full w-full">
              <div className="relative z-10">
                <h3 className="text-white font-bold text-lg leading-tight">Supporto e informazioni utili</h3>
              </div>
              {/* Background 'A' Element */}
              <img 
                src={aComponentImg} 
                alt="" 
                className="absolute -left-0 -bottom-0 h-[80%] w-auto object-contain pointer-events-none z-0 opacity-20 select-none mix-blend-overlay"
              />
              <img 
                src={supportoImg} 
                alt="Supporto" 
                className="absolute bottom-0 right-0 w-32 h-32 object-contain translate-x-2 translate-y-6 group-hover:scale-105 transition-transform"
              />
              {/* Soft triangular gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-transparent to-white/10 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="mt-10 mb-10 pl-4">
        <div className="flex justify-between items-center pr-4 mb-4">
          <h2 className="text-xl font-bold text-primary-blue">Articoli</h2>
          <button 
            onClick={() => navigate('/articles')}
            className="text-sm text-gray-500 flex items-center hover:text-primary-blue"
          >
            Leggi tutti <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="flex overflow-x-auto space-x-4 pb-4 pr-4 scrollbar-hide transition-opacity duration-300">
          {status === 'loading' ? (
            <>
              <HomeArticleSkeleton />
              <HomeArticleSkeleton />
              <HomeArticleSkeleton />
            </>
          ) : (
            (wpArticles.length ? wpArticles.slice(0,4) : ARTICLES.slice(-4)).map((article: any) => (
              <div 
                key={article.id}
                onClick={() => navigate(`/articles/${article.id}`, { state: { from: '/home' } })}
                className="min-w-[240px] w-[240px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <ImageWithSkeleton src={article.image} alt="" />
                </div>
                <div className="p-3">
                  <h3 
                    className="font-bold text-sm text-gray-800 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: article.title }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-12 px-4 pb-12 relative">
        <div className="text-center mb-8 sticky top-8">
          <h2 className="text-4xl font-black text-primary-blue mb-4">I nostri consigli</h2>
          <p className="text-gray-600 text-sm">
            Affinché il gioco rimanga un GIOCO, presta attenzione ai seguenti suggerimenti:
          </p>
        </div>

        <div className="space-y-4">
          {TIPS.map((tip, index) => (
            <div 
              key={tip.id}
              ref={el => { tipRefs.current[index] = el; }}
              className="sticky rounded-2xl p-6 group overflow-visible shadow-md transform transition-transform flex flex-col"
              style={{ 
                minHeight: tipsMinHeight || undefined,
                top: `calc(180px + ${index * 10}px)`, 
                zIndex: 10 + index,
                background: tip.color || `linear-gradient(to bottom right, #64748b, #475569)`
              }}
            >
              {/* Border Layer */}
              <div className="absolute inset-0 z-20 rounded-2xl border-2 border-white/30 group-hover:border-white/60 transition-colors pointer-events-none" />
              
              <p className="text-white font-semibold text-[26px] leading-tight tracking-[0.04em] pr-4 relative z-10 flex-1">
                {tip.text}
              </p>
              <span className="absolute bottom-7 right-7 text-[64px] leading-none font-bold text-white opacity-10 select-none pointer-events-none tracking-normal z-0">
                {String(tip.id).padStart(2, '0')}
              </span>
            </div>
          ))}
          {/* Spacer to allow the last card to scroll up to its stacked position */}
          <div className="h-[40vh]" />
        </div>
      </div>



      {/* Disclaimer "Usa la testa" - fuori dalla sezione Tips */}
      <div className="px-4 py-6">
        <div className="bg-primary-blue/5 border-2 border-gray-200 rounded-2xl p-5">
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            &ldquo;Usa la testa&rdquo; è il progetto di Gioco Responsabile del Gruppo NOVOMATIC Italia, nato per promuovere una cultura del gioco sano e consapevole e per ricordare che il gioco deve rimanere un&apos;attività di puro divertimento e svago.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            Il progetto si propone come uno strumento di sensibilizzazione e prevenzione, offrendo risorse utili per riconoscere e gestire tempestivamente i segnali di gioco problematico.
          </p>
        </div>
      </div>

      {/* Loghi Istituzionali */}
      <div className="px-4 pt-4 pb-24 flex justify-center">
         <img src={loghiBalduzzi} alt="Loghi istituzionali" className="w-full max-w-md object-contain" />
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
              onClick={() => navigate('/quiz')}
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
