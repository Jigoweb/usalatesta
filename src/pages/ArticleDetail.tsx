import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Clock } from 'lucide-react';
import { ARTICLES } from '../data/articles';
import CerchiAiuto from '../components/CerchiAiuto';
import { ArticleDetailSkeleton } from '../components/ArticleSkeletons';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const article = ARTICLES.find(a => a.id === id);
  const [wpArticle, setWpArticle] = useState<any | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(article ? 'success' : 'idle');

  const handleBack = () => {
    // If we have a source in state (e.g. from Home or Articles), go there
    // Otherwise default to /articles
    const from = location.state?.from || '/articles';
    navigate(from);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!article && id) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      setStatus('loading');
      (async () => {
        try {
          const res = await fetch(`https://www.usa-la-testa.it/wp-json/wp/v2/posts/${id}?_embed`, {
            signal: controller.signal
          });
          if (!res.ok) throw new Error('API request failed');
          const p = await res.json();
          setWpArticle({
            title: p.title?.rendered || '',
            content: p.content?.rendered || '',
            image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
            category: 'Articoli',
            readTime: Math.max(1, Math.round(((p.content?.rendered || '').replace(/<[^>]+>/g, '').split(/\s+/).length) / 200)),
          });
          setStatus('success');
        } catch (err) {
          setStatus('error');
        } finally {
          clearTimeout(timeoutId);
        }
      })();

      return () => {
        controller.abort();
        clearTimeout(timeoutId);
      };
    }
  }, [article, id]);

  if (status === 'loading') {
    return <ArticleDetailSkeleton />;
  }

  if (status === 'error' || (!article && !wpArticle && status !== 'idle')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Caricamento articolo…</h2>
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
      {/* Header */}
      <div className="p-4 flex items-center bg-white shadow-sm sticky top-0 z-50">
        <button onClick={handleBack} className="mr-4">
          <ChevronLeft className="text-primary-blue" />
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative w-full">
        <img 
          src={(article ? article.image : wpArticle?.image) || ''} 
          alt={(article ? article.title : wpArticle?.title) || 'Articolo'} 
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Content Container */}
      <div className="bg-white px-6 pt-10 min-h-screen">
        {/* Meta Tags */}
        <div className="flex items-center space-x-3 mb-6">
          <span className="bg-blue-50 text-primary-blue px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider">
            {article ? article.category : wpArticle?.category}
          </span>
          <div className="flex items-center text-gray-400 text-xs font-medium">
            <Clock size={14} className="mr-1.5" />
            <span>{article ? article.readTime : wpArticle?.readTime} min lettura</span>
          </div>
        </div>

        {/* Title */}
        <h1 
          className="text-3xl font-black text-primary-blue mb-8 leading-tight"
          dangerouslySetInnerHTML={{ __html: article ? article.title : wpArticle?.title }}
        />

        {/* Article Body */}
        <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
          {article ? (
            <>
              {article.content.split('\n\n').map((block, index) => {
                const cleanBlock = block.trim();
                if (!cleanBlock) return null;
                if (cleanBlock.startsWith('**') && cleanBlock.endsWith('**')) {
                  const text = cleanBlock.slice(2, -2);
                  if (text === article.title) return null;
                  return (
                    <h2 key={index} className="text-xl font-bold text-primary-blue mt-8 mb-2 leading-tight">
                      {text}
                    </h2>
                  );
                }
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
            </>
          ) : (
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: wpArticle?.content || '' }} />
          )}
        </div>

        <CerchiAiuto
          className="mt-16 mb-10"
          onScopriCentriClick={() => navigate('/support/centers')}
        />

        {/* Related Articles */}
        <div className="border-t border-gray-100 pt-10 pb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Prossimi articoli</h3>
            <div className="grid grid-cols-2 gap-4">
                {nextArticles.map(nextArticle => (
                    <div 
                      key={nextArticle.id} 
                      onClick={() => navigate(`/articles/${nextArticle.id}`, { state: { from: location.state?.from } })} 
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