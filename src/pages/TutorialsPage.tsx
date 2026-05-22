import { useApp } from '../context/AppContext';
import ArticleCard from '../components/articles/ArticleCard';
import AdBanner from '../components/ads/AdBanner';

export default function TutorialsPage() {
  const { articles } = useApp();
  const tutorials = articles.filter(a => a.type === 'tutorial');

  return (
    <div className="min-h-screen">
      <div className="bg-linear-to-br from-[#327CFA] via-[#1D4ED8] to-[#003CC6] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">📚 Tutorials</h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Step-by-step guides and hands-on tutorials for developers
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdBanner position="header" className="mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        {tutorials.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#94A3B8] text-lg">No tutorials available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
