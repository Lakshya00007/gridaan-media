import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Bookmark, TrendingUp } from 'lucide-react';
import LazyImage from '../ui/LazyImage';
import type { Article } from '../../types/article';
import { useBookmarks } from '../../hooks/useBookmarks';
import { getArticleDate, getArticleReadingTime, getArticleViews, slugifyCategory } from '../../utils/articleUtils';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'horizontal' | 'compact';
}

function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const { bookmarkIds, toggleBookmark, isSaving } = useBookmarks();
  const isBookmarked = bookmarkIds.has(article.id);
  const authorName = article.author || 'Admin';
  const authorInitial = authorName.charAt(0) || 'A';
  const articleImage = article.image_url || '';
  const categoryName = article.category || 'General';
  const categorySlug = slugifyCategory(categoryName);
  const publishedAt = getArticleDate(article);
  const readingTime = getArticleReadingTime(article);
  const views = getArticleViews(article);

  const formatViews = (views: number) => {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return 'Recently';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (variant === 'featured') {
    return (
      <article className="group overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
        <Link to={`/article/${article.slug}`} className="block aspect-[16/9] overflow-hidden border-b border-[#ececec]">
          {articleImage ? (
            <LazyImage
              src={articleImage}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority={true}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#f3f3f1] text-3xl text-[#b5b5b5]">📰</div>
          )}
        </Link>
        <div className="space-y-3 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[11px] font-medium text-[#6b6b6b]">
            <Link to={`/category/${categorySlug}`} className="rounded-full bg-[#f5f5f2] px-2.5 py-1 text-[#4a4a4a] hover:text-[#1d4ed8]">
              {categoryName}
            </Link>
            {article.trending && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
                <TrendingUp className="h-3 w-3" />
                Trending
              </span>
            )}
          </div>
          <Link to={`/article/${article.slug}`}>
            <h2 className="line-clamp-2 text-2xl font-semibold leading-tight text-[#1c1c1c] font-serif transition-colors group-hover:text-[#1d4ed8]">
              {article.title}
            </h2>
          </Link>
          <p className="line-clamp-2 text-sm leading-relaxed text-[#6b6b6b]">{article.excerpt}</p>
          <div className="flex items-center justify-between border-t border-[#efefef] pt-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef4ff] text-xs font-semibold text-[#1d4ed8]">
                {authorInitial}
              </div>
              <div className="text-xs">
                <p className="font-medium text-[#242424]">{authorName}</p>
                <p className="text-[#7a7a7a]">{formatDate(publishedAt)} · {readingTime} min read</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#7a7a7a]">
              <Eye className="h-3.5 w-3.5" />
              {formatViews(views)}
            </span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-4 py-5 border-b border-[#ececec] transition-colors">
        <Link to={`/article/${article.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[#ececec] bg-[#f8f8f7] md:h-28 md:w-40">
          {articleImage ? (
            <LazyImage
              src={articleImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600 text-xl font-bold">📄</div>
          )}
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="mb-1 flex items-center gap-2">
            <Link to={`/category/${categorySlug}`} className="text-[11px] font-medium text-[#6b6b6b] hover:text-[#1d4ed8]">
              {categoryName}
            </Link>
            {article.trending && <TrendingUp className="w-3.5 h-3.5 text-amber-500" />}
          </div>
          <Link to={`/article/${article.slug}`}>
            <h3 className="mb-1 line-clamp-2 text-base font-semibold text-[#1c1c1c] font-serif transition-colors group-hover:text-[#1d4ed8]">
              {article.title}
            </h3>
          </Link>
          <p className="mb-2 line-clamp-2 hidden text-sm text-[#6b6b6b] md:block">{article.excerpt}</p>
          <div className="flex items-center gap-2.5 text-[11px] text-[#7a7a7a]">
            <span className="font-medium text-[#3a3a3a]">{authorName}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readingTime} min</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(views)} views</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/article/${article.slug}`} className="group flex items-center gap-3 py-3 border-b border-border last:border-0">
        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-border bg-bg">
          {articleImage ? (
            <img src={articleImage} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full bg-slate-100 dark:bg-slate-800" />
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-text group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {article.title}
          </h4>
          <span className="text-[10px] text-text-secondary mt-1 block">{formatDate(publishedAt)} · {readingTime}m read</span>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/article/${article.slug}`} className="relative block aspect-[16/10] overflow-hidden border-b border-[#efefef]">
        {articleImage ? (
          <LazyImage
            src={articleImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[#f3f3f1]" />
        )}
        <div className="absolute inset-0 bg-black/0 opacity-0 transition-opacity group-hover:opacity-100" />
        {article.trending && (
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
            <TrendingUp className="w-3 h-3" /> Trending
          </div>
        )}
        
        {/* Bookmark actions */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={(e) => { 
              e.preventDefault(); 
              toggleBookmark(article.id, { title: article.title, slug: article.slug }); 
            }}
            disabled={isSaving}
            className={`rounded-lg p-1.5 transition-all disabled:cursor-not-allowed disabled:opacity-70 ${
              isBookmarked ? 'bg-[#1d4ed8] text-white' : 'border border-[#e6e6e6] bg-white text-[#6b6b6b] hover:text-[#1c1c1c]'
            }`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <span className="absolute bottom-3 left-3 rounded-full border border-[#e6e6e6] bg-white/95 px-2 py-0.5 text-[10px] font-medium text-[#4b4b4b]">
          {categoryName}
        </span>
      </Link>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <Link to={`/article/${article.slug}`}>
            <h3 className="mb-2 line-clamp-2 text-[1.05rem] font-semibold leading-snug text-[#1c1c1c] font-serif transition-colors group-hover:text-[#1d4ed8]">
              {article.title}
            </h3>
          </Link>
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#6b6b6b]">{article.excerpt}</p>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-[#efefef] pt-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef4ff] text-xs font-semibold text-[#1d4ed8]">
              {authorInitial}
            </div>
            <div>
              <span className="text-xs font-medium text-[#2f2f2f]">{authorName}</span>
              <div className="text-[10px] text-[#7a7a7a]">{formatDate(publishedAt)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#7a7a7a]">
            <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{readingTime}m</span>
            <span>·</span>
            <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{formatViews(views)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(ArticleCard);
