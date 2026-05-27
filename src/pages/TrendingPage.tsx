import ArticleCard from '../components/articles/ArticleCard';
import AdBanner from '../components/ads/AdBanner';
import Skeleton from '../components/ui/Skeleton';
import SEO from '../components/seo/SEO';
import { useSortedArticlesByViews, useTrendingArticles } from '../hooks/useArticles';

export default function TrendingPage() {
  const { data: trending = [], isLoading: trendingLoading, error: trendingError } = useTrendingArticles();
  const { data: sorted = [], isLoading: sortedLoading, error: sortedError } = useSortedArticlesByViews();
  const loading = trendingLoading || sortedLoading;
  const error = trendingError || sortedError;

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SEO 
        title="Trending Stories"
        description="The most read and trending stories in engineering, web development, and artificial intelligence."
      />
      <div className="relative overflow-hidden bg-mesh-hero border-b border-border text-text">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="text-2xl font-extrabold mb-4">Trending Now</h1>
          <p className="text-text-secondary text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            The most popular and talked-about stories in AI and technology
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdBanner position="header" className="mb-8" />
        {error && (
          <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-100">
            Unable to load trending articles right now.
          </div>
        )}
        
        {/* Featured Trending */}
        {loading ? (
          <div className="mb-8">
            <Skeleton className="h-[400px] rounded-3xl" />
          </div>
        ) : trending[0] && (
          <div className="mb-8 rounded-3xl overflow-hidden aspect-video max-h-[420px] border border-border shadow-xs">
            <ArticleCard article={trending[0]} variant="featured" />
          </div>
        )}

        <h2 className="text-xl font-bold text-text mb-6">Most Viewed</h2>
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
