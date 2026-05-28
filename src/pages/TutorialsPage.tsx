import ArticleCard from '../components/articles/ArticleCard'
import AdBanner from '../components/ads/AdBanner'
import Skeleton from '../components/ui/Skeleton'
import SEO from '../components/seo/SEO'
import PageHero from '../components/layout/PageHero'
import { useTutorialArticles } from '../hooks/useArticles'

export default function TutorialsPage() {
  const { data: tutorials = [], isLoading: loading, error } = useTutorialArticles()

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SEO 
        title="Guides & Tutorials"
        description="Learn step-by-step with practical hands-on software development, devops, and artificial intelligence tutorials."
      />
      <PageHero
        title="Tutorials"
        description="Step-by-step guides and hands-on tutorials for developers and engineers."
        className="text-center"
        compact
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdBanner position="header" className="mb-8" />
        {error && (
          <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
            Unable to load tutorials right now.
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [...Array(6)].map((_, index) => <Skeleton key={index} className="h-[320px]" />)
            : tutorials.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
        </div>
        {!loading && tutorials.length === 0 && !error && (
          <div className="text-center py-20 bg-card rounded-2xl border border-border p-8 shadow-sm max-w-md mx-auto">
            <p className="text-text-secondary text-xs">No tutorials available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
