import ArticleCard from '../components/articles/ArticleCard';
import AdBanner from '../components/ads/AdBanner';
import Skeleton from '../components/ui/Skeleton';
import { useSortedArticlesByViews, useTrendingArticles } from '../hooks/useArticles';

export default function TrendingPage() {
  const { data: trending = [], isLoading: trendingLoading, error: trendingError } = useTrendingArticles();
  const { data: sorted = [], isLoading: sortedLoading, error: sortedError } = useSortedArticlesByViews();
  const loading = trendingLoading || sortedLoading;
  const error = trendingError || sortedError;

  return (
    <div className="min-h-screen">
      <div className="bg-linear-to-br from-[#2563EB] via-[#14B8A6] to-[#1D4ED8] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🔥 Trending Now</h1>
          <p className="text-[#DCE7FF] text-lg max-w-2xl mx-auto">
            The most popular and talked about articles right now
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdBanner position="header" className="mb-8" />
        {error && (
          <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            Unable to load trending articles right now.
          </div>
        )}
        
        {/* Featured Trending */}
        {loading ? (
          <div className="mb-8">
            <Skeleton className="h-[400px] rounded-2xl" />
          </div>
        ) : trending[0] && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <ArticleCard article={trending[0]} variant="featured" />
          </div>
        )}

        <h2 className="text-2xl font-bold text-[#F8FAFC] dark:text-white mb-6">Most Viewed</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [...Array(6)].map((_, index) => <Skeleton key={index} className="h-[320px]" />)
            : sorted.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
        </div>
      </div>
    </div>
  );
}
