import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Bookmark, Share2, TrendingUp } from 'lucide-react';
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
      <div className="group relative block rounded-3xl overflow-hidden h-full border border-border shadow-xs hover:shadow-md bg-card transition-colors transform hover:-translate-y-1">
        <Link to={`/article/${article.slug}`} className="absolute inset-0 block">
          {articleImage ? (
            <LazyImage
              src={articleImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority={true}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
        </Link>
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8 min-h-[400px] pointer-events-none">
          {article.trending && (
            <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold tracking-wider mb-2">
              <TrendingUp className="w-3 h-3" />
              TRENDING
            </div>
          )}
          <span className="inline-block px-2.5 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full mb-3 w-fit">
            {categoryName}
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight group-hover:text-blue-200 transition-colors line-clamp-3">
            <Link to={`/article/${article.slug}`} className="pointer-events-auto">
              {article.title}
            </Link>
          </h2>
          <p className="text-slate-300 text-xs mb-4 line-clamp-2 hidden md:block">{article.excerpt}</p>
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                {authorInitial}
              </div>
              <div>
                <span className="text-slate-200 text-xs font-semibold">{authorName}</span>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                  <span>{formatDate(publishedAt)}</span>
                  <span>·</span>
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
              <span className="flex items-center gap-1 text-[11px]"><Eye className="w-3.5 h-3.5" />{formatViews(views)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-4 md:gap-6 py-5 border-b border-border transition-colors">
        <Link to={`/article/${article.slug}`} className="shrink-0 w-24 h-24 md:w-40 md:h-28 rounded-2xl overflow-hidden border border-border bg-bg">
          {articleImage ? (
            <LazyImage
              src={articleImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center text-primary text-xl font-bold">G</div>
          )}
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Link to={`/category/${categorySlug}`} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">
              {categoryName}
            </Link>
            {article.trending && <TrendingUp className="w-3.5 h-3.5 text-amber-500" />}
          </div>
          <Link to={`/article/${article.slug}`}>
            <h3 className="text-sm md:text-base font-bold text-text group-hover:text-primary transition-colors line-clamp-2 mb-1">
              {article.title}
            </h3>
          </Link>
          <p className="text-xs text-text-secondary line-clamp-2 hidden md:block mb-2">{article.excerpt}</p>
          <div className="flex items-center gap-3 text-[10px] text-text-secondary font-medium">
            <span className="font-bold text-text">{authorName}</span>
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
            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-blue-600/20" />
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
    <article className="group bg-card rounded-3xl overflow-hidden border border-border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
        <Link to={`/article/${article.slug}`} className="block relative overflow-hidden aspect-16/10 border-b border-border/50">
        {articleImage ? (
          <LazyImage
            src={articleImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500" />
        )}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        {article.trending && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full shadow-xs">
            <TrendingUp className="w-3 h-3" /> Trending
          </div>
        )}
        
        {/* Bookmark actions */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { 
              e.preventDefault(); 
              toggleBookmark(article.id, { title: article.title, slug: article.slug }); 
            }}
            disabled={isSaving}
            className={`p-1.5 rounded-lg backdrop-blur-md transition-all disabled:cursor-not-allowed disabled:opacity-70 ${
              isBookmarked ? 'bg-primary text-white' : 'bg-card/85 text-text-secondary hover:text-text hover:bg-card border border-border'
            }`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-card/80 backdrop-blur-md text-text text-[10px] font-bold border border-border/80 rounded-full">
          {categoryName}
        </span>
      </Link>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/article/${article.slug}`}>
            <h3 className="text-base font-bold text-text group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
              {article.title}
            </h3>
          </Link>
          <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">{article.excerpt}</p>
        </div>
        <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-primary text-xs font-bold border border-blue-200/50">
              {authorInitial}
            </div>
            <div>
              <span className="text-xs font-semibold text-text">{authorName}</span>
              <div className="text-[10px] text-text-secondary">{formatDate(publishedAt)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-text-secondary font-medium">
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
