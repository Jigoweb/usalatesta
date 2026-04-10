import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock } from 'lucide-react';
import { ARTICLES } from '../data/articles';
import { ArticleCardSkeleton } from '../components/ArticleSkeletons';

export default function Articles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const load = async () => {
      try {
        const res = await fetch('https://www.usa-la-testa.it/wp-json/wp/v2/posts?_embed&per_page=10', {
          signal: controller.signal
        });
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        const mapped = data.map((p: any) => ({
          id: String(p.id),
          title: p.title?.rendered || '',
          excerpt: p.excerpt?.rendered || '',
          image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
          category: 'Articoli',
          readTime: Math.max(1, Math.round(((p.content?.rendered || '').replace(/<[^>]+>/g, '').split(/\s+/).length) / 200)),
        }));
        setArticles(mapped);
        setStatus('success');
      } catch (err) {
        // Mostra gli articoli di default come fallback in caso di errore o timeout
        setArticles(ARTICLES);
        setStatus('error');
      } finally {
        clearTimeout(timeoutId);
      }
    };
    load();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="p-4 flex items-center bg-white shadow-sm sticky top-0 z-50">
        <button onClick={() => navigate('/home')} className="mr-4">
          <ChevronLeft className="text-primary-blue" />
        </button>
      </div>

      <div className="p-4 grid gap-4 transition-opacity duration-300">
        {status === 'loading' ? (
          <>
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
          </>
        ) : (
          articles.map((article: any) => (
            <div 
              key={article.id} 
              onClick={() => navigate(`/articles/${article.id}`, { state: { from: '/articles' } })}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img src={article.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span className="bg-blue-50 text-primary-blue px-2 py-1 rounded-full font-medium mr-2">
                    {article.category}
                  </span>
                  <Clock size={12} className="mr-1" />
                  {article.readTime} min lettura
                </div>
                <h2 
                  className="text-lg font-bold text-gray-800 mb-2 line-clamp-2" 
                  dangerouslySetInnerHTML={{ __html: article.title }} 
                />
                <div 
                  className="text-gray-600 text-sm line-clamp-2 prose-sm prose-p:m-0" 
                  dangerouslySetInnerHTML={{ __html: article.excerpt }} 
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}