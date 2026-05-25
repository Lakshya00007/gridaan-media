import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHero from '../components/layout/PageHero';
import Skeleton from '../components/ui/Skeleton';
import { useCategories } from '../hooks/useArticles';

export default function CategoriesPage() {
  const { data: categories = [], isLoading: loading, error } = useCategories();

  return (
    <div className="min-h-screen">
      <PageHero
        title="Explore Categories"
        description="Browse curated content across AI, engineering, business, and culture"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [...Array(6)].map((_, index) => <Skeleton key={index} className="h-56 rounded-2xl" />)
            : categories.map(cat => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="group relative bg-[#0B1224] dark:bg-[#0B1224]/50 rounded-2xl border border-[#1E293B]/50 dark:border-[#1E293B]/50 p-8 hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10" style={{ backgroundColor: cat.color }} />
                  <span className="text-4xl mb-4 block">{cat.icon}</span>
                  <h2 className="text-xl font-bold text-[#F8FAFC] dark:text-white mb-2 group-hover:text-[#2563EB] dark:group-hover:text-[#94A3B8] transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-sm text-[#94A3B8] dark:text-[#94A3B8] mb-4">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                      {cat.count} articles
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
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
