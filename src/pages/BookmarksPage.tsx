import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ArticleCard from '../components/articles/ArticleCard';

export default function BookmarksPage() {
  const { articles, bookmarks } = useApp();
  const bookmarkedArticles = articles.filter(a => bookmarks.includes(a.id));

  return (
    <div className="min-h-screen">
      <div className="bg-linear-to-br from-[#060A16] via-[#0A1222] to-[#0B1224] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Bookmark className="w-12 h-12 mx-auto mb-4 text-[#94A3B8]" />
          <h1 className="text-4xl font-bold mb-4">Your Bookmarks</h1>
          <p className="text-[#94A3B8] text-lg">{bookmarkedArticles.length} saved articles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {bookmarkedArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📌</div>
            <h2 className="text-xl font-bold text-[#F8FAFC] dark:text-white mb-2">No bookmarks yet</h2>
            <p className="text-[#94A3B8] dark:text-[#94A3B8] mb-6">Save articles you want to read later</p>
            <Link to="/" className="text-[#327CFA] hover:underline">Discover articles</Link>
          </div>
        )}
      </div>
    </div>
  );
}
