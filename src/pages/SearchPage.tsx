import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import PageHero from '../components/layout/PageHero';
import ArticleCard from '../components/articles/ArticleCard';
import Skeleton from '../components/ui/Skeleton';
import SEO from '../components/seo/SEO';
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
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SEO 
        title={query ? `Search results for "${query}"` : 'Search Articles'}
        description="Search across all technological articles, tutorials, and insights published on Gridaan."
      />
      <PageHero
        title="Search"
        description={query ? `${results.length} results for "${query}"` : 'Find articles, tutorials, and insights'}
        compact
      >
        <form className="relative max-w-xl mx-auto" onSubmit={handleSearch}>
          <label htmlFor="search-input" className="sr-only">Search articles</label>
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" aria-hidden />
          <input
            id="search-input"
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search articles…"
            className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-xs text-text placeholder-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </form>
      </PageHero>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {loading ? (
          <div className="space-y-0">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex flex-col gap-4 py-4 border-b border-border last:border-0">
                <Skeleton className="h-24 w-full rounded-[1.25rem]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-100">
            Unable to load search results right now.
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-0">
            {results.map(article => (
              <ArticleCard key={article.id} article={article} variant="horizontal" />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border p-8 shadow-xs max-w-lg mx-auto">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-sm font-bold text-text mb-1">No results found</h2>
            <p className="text-xs text-text-secondary mb-6 leading-relaxed">Try different keywords or browse our categories</p>
            <Link to="/categories" className="px-5 py-2.5 bg-primary text-white rounded-full text-xs font-bold hover:bg-[#1d4ed8] shadow-xs">Browse Categories</Link>
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-border p-8 shadow-xs max-w-lg mx-auto">
            <div className="text-4xl mb-4">✨</div>
            <h2 className="text-sm font-bold text-text mb-1">Start searching</h2>
            <p className="text-xs text-text-secondary">Type something to search across all articles</p>
          </div>
        )}
      </div>
    </div>
  );
}
