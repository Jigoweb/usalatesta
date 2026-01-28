import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, Clock } from 'lucide-react';
import { ARTICLES } from '../data/articles';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = ARTICLES.find(a => a.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Articolo non trovato</h2>
          <button 
            onClick={() => navigate('/articles')}
            className="text-primary-blue font-bold hover:underline"
          >
            Torna agli articoli
          </button>
        </div>
      </div>
    );
  }

  // Filter other articles for "Prossimi articoli" (simple logic: take next 2 or random 2)
  // To keep it stable, let's take the ones immediately after the current one, wrapping around
  const currentIndex = ARTICLES.findIndex(a => a.id === id);
  const nextArticles = [
    ARTICLES[(currentIndex + 1) % ARTICLES.length],
    ARTICLES[(currentIndex + 2) % ARTICLES.length]
  ];

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      {/* Immersive Header */}
      <div className="relative h-72 w-full">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10 pointer-events-none" />
        
        {/* Navbar */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>

      {/* Content Container - Overlapping the image */}
      <div className="relative z-10 -mt-8 bg-white rounded-t-[2.5rem] px-6 pt-10 shadow-xl min-h-screen">
        {/* Meta Tags */}
        <div className="flex items-center space-x-3 mb-6">
          <span className="bg-blue-50 text-primary-blue px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider">
            {article.category}
          </span>
          <div className="flex items-center text-gray-400 text-xs font-medium">
            <Clock size={14} className="mr-1.5" />
            <span>{article.readTime} min lettura</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-primary-blue mb-8 leading-tight">
          {article.title}
        </h1>

        {/* Article Body */}
        <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
          {article.content.split('\n\n').map((block, index) => {
             const cleanBlock = block.trim();
             if (!cleanBlock) return null;
             
             // Check for bold text (used as subheadings in the data)
             // Pattern: **Text**
             if (cleanBlock.startsWith('**') && cleanBlock.endsWith('**')) {
               const text = cleanBlock.slice(2, -2);
               // If it matches title exactly, skip it as we already rendered H1
               if (text === article.title) return null;
               
               return (
                 <h2 key={index} className="text-xl font-bold text-primary-blue mt-8 mb-2 leading-tight">
                   {text}
                 </h2>
               );
             }
             
             // Render paragraph with inline bold support
             const parts = cleanBlock.split(/(\*\*.*?\*\*)/g);
             return (
               <p key={index}>
                 {parts.map((part, i) => {
                   if (part.startsWith('**') && part.endsWith('**')) {
                     return <strong key={i} className="font-bold text-gray-800">{part.slice(2, -2)}</strong>;
                   }
                   return part;
                 })}
               </p>
             );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-16 mb-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Cerchi aiuto?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Numero Verde Nazionale DGA */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
                 <div>
                    <span className="text-[10px] text-gray-400 block mb-1">Istituto Superiore di Sanità</span>
                    <h4 className="text-base font-bold text-gray-900 leading-tight mb-6">Numero Verde<br/>Nazionale DGA</h4>
                 </div>
                 <a href="tel:800558822" className="flex items-center border border-green-500 rounded-xl overflow-hidden group">
                    <div className="bg-green-500 p-2 flex items-center justify-center">
                        <Phone className="text-white fill-current" size={20} />
                    </div>
                    <div className="flex-1 text-center py-2">
                        <span className="text-[8px] block text-green-600 font-bold uppercase tracking-tighter leading-none mb-0.5">TELEFONO VERDE NAZIONALE</span>
                        <span className="text-lg font-bold text-green-600 block leading-none">800 - 558822</span>
                        <span className="text-[6px] block text-green-600 font-bold uppercase tracking-tighter leading-none mt-0.5">PROBLEMATICHE GIOCO D'AZZARDO</span>
                    </div>
                 </a>
              </div>
              
              {/* Konsumer Italia */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
                 <div>
                    <span className="text-[10px] text-gray-400 block mb-1">Konsumer Italia</span>
                    <h4 className="text-base font-bold text-gray-900 leading-tight mb-6">Non Dipendo,<br/>scelgo!</h4>
                 </div>
                 <a href="tel:800558822" className="flex items-center border border-green-500 rounded-xl overflow-hidden group">
                    <div className="bg-green-500 p-2 flex items-center justify-center">
                        <Phone className="text-white fill-current" size={20} />
                    </div>
                    <div className="flex-1 text-center py-2">
                        <span className="text-[8px] block text-green-600 font-bold uppercase tracking-tighter leading-none mb-0.5">TELEFONO VERDE NAZIONALE</span>
                        <span className="text-lg font-bold text-green-600 block leading-none">800 - 558822</span>
                        <span className="text-[6px] block text-green-600 font-bold uppercase tracking-tighter leading-none mt-0.5">PROBLEMATICHE GIOCO D'AZZARDO</span>
                    </div>
                 </a>
              </div>
            </div>
            
            <p className="text-[10px] text-gray-500 leading-tight mt-6 text-center max-w-lg mx-auto">
               Il Disturbo da Gioco d'Azzardo (DGA) è una dipendenza comportamentale, riconosciuta nei Livelli Essenziali di Assistenza dal Sistema Sanitario Nazionale, e deve essere affrontata da professionisti, esattamente come ogni altra dipendenza.
            </p>
        </div>

        {/* Related Articles */}
        <div className="border-t border-gray-100 pt-10 pb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Prossimi articoli</h3>
            <div className="grid grid-cols-2 gap-4">
                {nextArticles.map(nextArticle => (
                    <div 
                      key={nextArticle.id} 
                      onClick={() => navigate(`/articles/${nextArticle.id}`)} 
                      className="cursor-pointer group flex flex-col h-full"
                    >
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3 relative bg-gray-100">
                             <img 
                               src={nextArticle.image} 
                               alt={nextArticle.title}
                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                             />
                        </div>
                        <h4 className="font-bold text-sm text-primary-blue line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                          {nextArticle.title}
                        </h4>
                    </div>
                ))}
            </div>
             <button 
               onClick={() => navigate('/articles')} 
               className="w-full mt-8 py-4 border-2 border-gray-100 rounded-2xl text-gray-500 font-bold text-sm hover:bg-gray-50 hover:text-gray-800 transition-all uppercase tracking-wide"
             >
                Leggi altro
            </button>
        </div>
      </div>
    </div>
  );
}