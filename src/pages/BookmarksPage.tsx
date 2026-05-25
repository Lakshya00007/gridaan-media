import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import PageHero from '../components/layout/PageHero';
import ArticleCard from '../components/articles/ArticleCard';
import Skeleton from '../components/ui/Skeleton';
import { useArticles } from '../hooks/useArticles';
import { useBookmarks } from '../hooks/useBookmarks';

export default function BookmarksPage() {
  const { data: articles = [], isLoading: articlesLoading, error: articlesError } = useArticles();
  const { bookmarkIds, loading: bookmarksLoading, error: bookmarksError, user } = useBookmarks();
  const loading = articlesLoading || bookmarksLoading;
  const error = articlesError || bookmarksError;
  const bookmarkedArticles = articles.filter(a => bookmarkIds.has(a.id));

  return (
    <div className="min-h-screen">
      <PageHero
        title="Your Bookmarks"
        description={`${bookmarkedArticles.length} saved articles`}
        compact
      >
        <Bookmark className="w-10 h-10 text-[#14B8A6]" aria-hidden />
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => <Skeleton key={index} className="h-[320px]" />)}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            Unable to load bookmarks right now.
          </div>
        ) : !user ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📌</div>
            <h2 className="text-xl font-bold text-[#F8FAFC] dark:text-white mb-2">Sign in to save bookmarks</h2>
            <p className="text-[#94A3B8] dark:text-[#94A3B8] mb-6">Bookmarks sync across devices when you are signed in.</p>
            <Link to="/login" className="text-[#2563EB] hover:underline">Sign in</Link>
          </div>
        ) : bookmarkedArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📌</div>
            <h2 className="text-xl font-bold text-[#F8FAFC] dark:text-white mb-2">No bookmarks yet</h2>
            <p className="text-[#94A3B8] dark:text-[#94A3B8] mb-6">Save articles you want to read later</p>
            <Link to="/" className="text-[#2563EB] hover:underline">Discover articles</Link>
          </div>
        )}
      </div>
    </div>
  );
}
