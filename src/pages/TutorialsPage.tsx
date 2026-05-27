import ArticleCard from '../components/articles/ArticleCard';
import AdBanner from '../components/ads/AdBanner';
import Skeleton from '../components/ui/Skeleton';
import SEO from '../components/seo/SEO';
import { useTutorialArticles } from '../hooks/useArticles';

export default function TutorialsPage() {
  const { data: tutorials = [], isLoading: loading, error } = useTutorialArticles();

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SEO 
        title="Guides & Tutorials"
        description="Learn step-by-step with practical hands-on software development, devops, and artificial intelligence tutorials."
      />
      <div className="bg-mesh-hero border-b border-border text-text">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-extrabold mb-4">📚 Tutorials</h1>
          <p className="text-text-secondary text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Step-by-step guides and hands-on tutorials for developers and engineers
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdBanner position="header" className="mb-8" />
        {error && (
          <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-100">
            Unable to load tutorials right now.
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [...Array(6)].map((_, index) => <Skeleton key={index} className="h-[320px]" />)
            : tutorials.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
        </div>
        {!loading && tutorials.length === 0 && !error && (
          <div className="text-center py-20 bg-card rounded-3xl border border-border p-8 shadow-xs max-w-md mx-auto">
            <p className="text-text-secondary text-xs">No tutorials available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
