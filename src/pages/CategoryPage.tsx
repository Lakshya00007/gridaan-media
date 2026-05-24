import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ArticleCard from '../components/articles/ArticleCard';
import AdBanner from '../components/ads/AdBanner';
import Skeleton from '../components/ui/Skeleton';
import { useArticles, useCategories } from '../hooks/useArticles';
import { slugifyCategory } from '../utils/articleUtils';

export default function CategoryPage() {
  const { slug } = useParams();
  const { data: articles = [], isLoading: articlesLoading, error: articlesError } = useArticles();
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const loading = articlesLoading || categoriesLoading;
  const error = articlesError || categoriesError;
  const category = categories.find(c => c.slug === slug);
  
  const categoryArticles = articles.filter(a => {
    return slugifyCategory(a.category) === slug;
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="bg-linear-to-br from-[#060A16] via-[#0A1222] to-[#0B1224] text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <Skeleton className="h-4 w-64 mb-6" />
            <Skeleton className="h-12 w-80" />
            <Skeleton className="h-5 w-56 mt-3" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => <Skeleton key={index} className="h-[320px]" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-[#F8FAFC] dark:text-white mb-4">Category Not Found</h1>
        {error && <p className="text-[#94A3B8] dark:text-[#94A3B8] mb-4">Unable to load this category right now.</p>}
        <Link to="/categories" className="text-[#2563EB] hover:underline">Browse all categories</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-linear-to-br from-[#060A16] via-[#0A1222] to-[#0B1224] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-[#94A3B8] mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/categories" className="hover:text-white">Categories</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#94A3B8]">{category.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{category.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
              <p className="text-[#94A3B8] mt-1">{category.description} · {categoryArticles.length} articles</p>
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
            <p className="text-[#94A3B8] dark:text-[#94A3B8] text-lg">No articles in this category yet.</p>
            <Link to="/" className="text-[#2563EB] hover:underline mt-2 inline-block">Browse all articles</Link>
          </div>
        )}
      </div>
    </div>
  );
}
