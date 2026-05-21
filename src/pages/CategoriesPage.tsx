import { Link } from 'react-router-dom';
import { categories } from '../data/mockData';
import { ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Categories</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Browse our curated collection of content across all technology domains
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.slug}`} className="group relative bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10" style={{ backgroundColor: cat.color }} />
              <span className="text-4xl mb-4 block">{cat.icon}</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {cat.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{cat.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                  {cat.count} articles
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
