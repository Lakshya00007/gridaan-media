import { useApp } from '../context/AppContext';
import ArticleCard from '../components/articles/ArticleCard';
import AdBanner from '../components/ads/AdBanner';

export default function TrendingPage() {
  const { articles } = useApp();
  const trending = articles.filter(a => a.trending);
  const sorted = [...articles].sort((a, b) => b.views - a.views);

  return (
    <div className="min-h-screen">
      <div className="bg-linear-to-br from-orange-600 via-red-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🔥 Trending Now</h1>
          <p className="text-orange-100 text-lg max-w-2xl mx-auto">
            The most popular and talked about articles right now
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdBanner position="header" className="mb-8" />
        
        {/* Featured Trending */}
        {trending[0] && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <ArticleCard article={trending[0]} variant="featured" />
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Most Viewed</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
