import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHero from '../components/layout/PageHero';
import Skeleton from '../components/ui/Skeleton';
import SEO from '../components/seo/SEO';
import { useCategories } from '../hooks/useArticles';

export default function CategoriesPage() {
  const { data: categories = [], isLoading: loading, error } = useCategories();

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SEO 
        title="Explore Categories"
        description="Browse technology categories including Artificial Intelligence, Programming, Web Development, and DevOps."
      />
      <PageHero
        title="Explore Categories"
        description="Browse curated content across AI, engineering, business, and culture"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [...Array(6)].map((_, index) => <Skeleton key={index} className="h-56 rounded-2xl" />)
            : categories.map(cat => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="group relative bg-card rounded-2xl border border-border p-8 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5" style={{ backgroundColor: cat.color }} />
                  <span className="text-4xl mb-4 block">{cat.icon}</span>
                  <h2 className="text-lg font-bold text-text mb-2 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-text-secondary mb-4 leading-relaxed">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                      {cat.count} articles
                    </span>
                    <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
        </div>
        {error && (
          <div className="mt-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            Unable to load categories right now.
          </div>
        )}
        {!loading && categories.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-[#94A3B8] text-lg">No categories available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
