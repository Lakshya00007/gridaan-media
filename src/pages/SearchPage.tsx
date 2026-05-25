import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import PageHero from '../components/layout/PageHero';
import ArticleCard from '../components/articles/ArticleCard';
import Skeleton from '../components/ui/Skeleton';
import { useArticles } from '../hooks/useArticles';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const { data: articles = [], isLoading: loading, error } = useArticles();

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      (a.excerpt || '').toLowerCase().includes(q) ||
      (a.category || '').toLowerCase().includes(q) ||
      (a.author || '').toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q)
    );
  }, [query, articles]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const nextQuery = searchQuery.trim();
    if (nextQuery) {
      navigate(`/search?q=${encodeURIComponent(nextQuery)}`);
    }
  };

  return (
    <div className="min-h-screen">
      <PageHero
        title="Search"
        description={query ? `${results.length} results for "${query}"` : 'Find articles, tutorials, and insights'}
        compact
      >
        <form className="relative max-w-xl" onSubmit={handleSearch}>
          <label htmlFor="search-input" className="sr-only">Search articles</label>
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" aria-hidden />
          <input
            id="search-input"
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search articles…"
            className="w-full rounded-2xl border border-white/10 bg-[#0B1224]/60 py-3.5 pl-12 pr-4 text-white placeholder-[#64748B] backdrop-blur-md focus:border-[#2563EB]/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25"
          />
        </form>
      </PageHero>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {loading ? (
          <div className="space-y-0">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col gap-4 py-4 border-b border-[#1E293B] dark:border-[#1E293B] last:border-0">
                <Skeleton className="h-24 w-full rounded-[1.25rem]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            Unable to load search results right now.
          </div>
        ) : results.length > 0 ? (
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
            <Link to="/categories" className="text-[#2563EB] hover:underline">Browse Categories</Link>
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
