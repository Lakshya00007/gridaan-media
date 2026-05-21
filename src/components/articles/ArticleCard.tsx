import { Link } from 'react-router-dom';
import { Clock, Eye, Heart, Bookmark, Share2, TrendingUp } from 'lucide-react';
import { Article } from '../../types';
import { useApp } from '../../context/AppContext';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'horizontal' | 'compact';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const { bookmarks, toggleBookmark } = useApp();
  const isBookmarked = bookmarks.includes(article.id);

  const formatViews = (views: number) => {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
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
      <Link to={`/article/${article.slug}`} className="group relative block rounded-2xl overflow-hidden h-full">
        <div className="absolute inset-0">
          <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8 min-h-[400px]">
          {article.trending && (
            <div className="flex items-center gap-1.5 text-orange-400 text-xs font-semibold mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              TRENDING
            </div>
          )}
          <span className="inline-block px-3 py-1 bg-indigo-500/90 text-white text-xs font-medium rounded-full mb-3 w-fit">
            {article.category}
          </span>
          <h2 className="text-xl md:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-indigo-300 transition-colors line-clamp-3">
            {article.title}
          </h2>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2 hidden md:block">{article.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <span className="text-white text-sm font-medium">{article.author.name}</span>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <span>{formatDate(article.publishedAt)}</span>
                  <span>·</span>
                  <span>{article.readingTime} min read</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-xs">
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatViews(article.views)}</span>
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{formatViews(article.likes)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-4 md:gap-6 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <Link to={`/article/${article.slug}`} className="shrink-0 w-24 h-24 md:w-40 md:h-28 rounded-xl overflow-hidden">
          <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Link to={`/category/${article.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
              {article.category}
            </Link>
            {article.trending && <TrendingUp className="w-3 h-3 text-orange-500" />}
          </div>
          <Link to={`/article/${article.slug}`}>
            <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-1.5">
              {article.title}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 hidden md:block mb-2">{article.excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{article.author.name}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readingTime}m</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(article.views)}</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/article/${article.slug}`} className="group flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
          <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {article.title}
          </h4>
          <span className="text-xs text-gray-500">{formatDate(article.publishedAt)} · {article.readingTime}m</span>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <article className="group bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1">
      <Link to={`/article/${article.slug}`} className="block relative overflow-hidden aspect-[16/10]">
        <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {article.trending && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
            <TrendingUp className="w-3 h-3" /> Trending
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.preventDefault(); toggleBookmark(article.id); }} className={`p-1.5 rounded-lg backdrop-blur-sm transition-colors ${isBookmarked ? 'bg-indigo-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'}`}>
            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <button onClick={(e) => e.preventDefault()} className="p-1.5 bg-white/80 text-gray-700 rounded-lg backdrop-blur-sm hover:bg-white transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-indigo-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
          {article.category}
        </span>
      </Link>
      <div className="p-5">
        <Link to={`/article/${article.slug}`}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2 leading-snug">
            {article.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{article.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {article.author.name.charAt(0)}
            </div>
            <div>
              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{article.author.name}</span>
              <div className="text-[11px] text-gray-400">{formatDate(article.publishedAt)}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readingTime}m</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(article.views)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
