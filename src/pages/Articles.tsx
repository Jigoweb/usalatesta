import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock } from 'lucide-react';
import { ARTICLES } from '../data/articles';

export default function Articles() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="p-4 flex items-center bg-white shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate('/home')} className="mr-4">
          <ChevronLeft className="text-primary-blue" />
        </button>
      </div>

      <div className="p-4 grid gap-4">
        {ARTICLES.map((article) => (
          <div 
            key={article.id} 
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
          >
            <div className="h-48 w-full">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <span className="bg-blue-50 text-primary-blue px-2 py-1 rounded-full font-medium mr-2">
                  {article.category}
                </span>
                <Clock size={12} className="mr-1" />
                {article.readTime} min lettura
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">{article.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}