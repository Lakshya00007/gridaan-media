import ArticleCard from '../components/articles/ArticleCard';
import AdBanner from '../components/ads/AdBanner';
import Skeleton from '../components/ui/Skeleton';
import { useTutorialArticles } from '../hooks/useArticles';

export default function TutorialsPage() {
  const { data: tutorials = [], isLoading: loading, error } = useTutorialArticles();

  return (
    <div className="min-h-screen">
      <div className="bg-linear-to-br from-[#2563EB] via-[#14B8A6] to-[#334155] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">📚 Tutorials</h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Step-by-step guides and hands-on tutorials for developers
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdBanner position="header" className="mb-8" />
        {error && (
          <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
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
          <div className="text-center py-20">
            <p className="text-[#94A3B8] text-lg">No tutorials available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
