import ArticleCard from '../components/articles/ArticleCard'
import AdBanner from '../components/ads/AdBanner'
import Skeleton from '../components/ui/Skeleton'
import SEO from '../components/seo/SEO'
import PageHero from '../components/layout/PageHero'
import { useSortedArticlesByViews, useTrendingArticles } from '../hooks/useArticles'

export default function TrendingPage() {
  const { data: trending = [], isLoading: trendingLoading, error: trendingError } = useTrendingArticles()
  const { data: sorted = [], isLoading: sortedLoading, error: sortedError } = useSortedArticlesByViews()
  const loading = trendingLoading || sortedLoading
  const error = trendingError || sortedError

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SEO 
        title="Trending Stories"
        description="The most read and trending stories in engineering, web development, and artificial intelligence."
      />
      <PageHero
        title="Trending Now"
        description="The most popular and talked-about stories in AI and technology."
        className="text-center"
        compact
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdBanner position="header" className="mb-8" />
        {error && (
          <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
            Unable to load trending articles right now.
          </div>
        )}
        
        {/* Featured Trending */}
        {loading ? (
          <div className="mb-8">
            <Skeleton className="h-[400px] rounded-2xl" />
          </div>
        ) : trending[0] && (
          <div className="mb-8 rounded-2xl overflow-hidden aspect-video max-h-[420px] border border-border shadow-sm">
            <ArticleCard article={trending[0]} variant="featured" />
          </div>
        )}

        <h2 className="text-xl font-bold text-text mb-6">Most Viewed</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [...Array(6)].map((_, index) => <Skeleton key={index} className="h-[320px]" />)
            : sorted.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
        </div>
      </div>
    </div>
  )
}
