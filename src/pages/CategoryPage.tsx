import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/mockData';
import ArticleCard from '../components/articles/ArticleCard';
import AdBanner from '../components/ads/AdBanner';

export default function CategoryPage() {
  const { slug } = useParams();
  const { articles } = useApp();

  const category = categories.find(c => c.slug === slug);
  
  const categoryArticles = articles.filter(a => {
    const catSlug = a.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
    return catSlug === slug;
  });

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Category Not Found</h1>
        <Link to="/categories" className="text-indigo-600 hover:underline">Browse all categories</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/categories" className="hover:text-white">Categories</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-300">{category.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{category.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
              <p className="text-gray-300 mt-1">{category.description} · {categoryArticles.length} articles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdBanner position="header" className="mb-8" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {categoryArticles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No articles in this category yet.</p>
            <Link to="/" className="text-indigo-600 hover:underline mt-2 inline-block">Browse all articles</Link>
          </div>
        )}
      </div>
    </div>
  );
}
