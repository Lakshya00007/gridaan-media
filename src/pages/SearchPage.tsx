import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ArticleCard from '../components/articles/ArticleCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { articles, searchQuery, setSearchQuery } = useApp();

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [query, articles]);

  return (
    <div className="min-h-screen">
      <div className="bg-linear-to-br from-[#060A16] via-[#0A1222] to-[#0B1224] text-white">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Search Results</h1>
          <form className="relative" onSubmit={e => { e.preventDefault(); if (searchQuery) window.location.href = `/search?q=${searchQuery}`; }}>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input
              type="text"
              defaultValue={query}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-14 pr-6 py-4 bg-[#0B1224]/10 backdrop-blur border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </form>
          {query && <p className="mt-4 text-[#94A3B8]">{results.length} results for "{query}"</p>}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {results.length > 0 ? (
          <div className="space-y-0">
            {results.map(article => (
              <ArticleCard key={article.id} article={article} variant="horizontal" />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-[#F8FAFC] dark:text-white mb-2">No results found</h2>
            <p className="text-[#94A3B8] dark:text-[#94A3B8] mb-6">Try different keywords or browse our categories</p>
            <Link to="/categories" className="text-[#327CFA] hover:underline">Browse Categories</Link>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-xl font-bold text-[#F8FAFC] dark:text-white mb-2">Start searching</h2>
            <p className="text-[#94A3B8] dark:text-[#94A3B8]">Type something to search across all articles</p>
          </div>
        )}
      </div>
    </div>
  );
}
