import { Link } from 'react-router-dom';
import { Play, Clock, Eye } from 'lucide-react';
import AdBanner from '../components/ads/AdBanner';
import Skeleton from '../components/ui/Skeleton';
import { useVideoArticles } from '../hooks/useArticles';
import { getArticleReadingTime, getArticleViews } from '../utils/articleUtils';

export default function VideosPage() {
  const { data: videos = [], isLoading: loading, error } = useVideoArticles();

  return (
    <div className="min-h-screen">
      <div className="bg-linear-to-br from-[#2563EB] via-[#0A1222] to-[#0B1224] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🎬 Videos</h1>
          <p className="text-slate-200 text-lg max-w-2xl mx-auto">
            Watch tutorials, tech talks, and expert discussions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdBanner position="header" className="mb-8" />
        {error && (
          <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            Unable to load videos right now.
          </div>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [...Array(6)].map((_, index) => <Skeleton key={index} className="h-[300px]" />)
            : videos.map(article => {
                const readingTime = getArticleReadingTime(article);
                const views = getArticleViews(article);
                return (
                  <Link key={article.id} to={`/article/${article.slug}`} className="group bg-[#0B1224] dark:bg-[#0B1224]/50 rounded-2xl overflow-hidden border border-[#1E293B]/50 dark:border-[#1E293B]/50 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="relative aspect-video overflow-hidden">
                      {article.image_url ? (
                        <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#2563EB]" />
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 bg-[#0B1224]/90 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-[#F8FAFC] ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs rounded font-mono">
                        {readingTime}:00
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[#F8FAFC] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-[#94A3B8] transition-colors line-clamp-2 mb-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                        <span>{article.author || 'Admin'}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(views / 1000).toFixed(1)}K</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readingTime}m</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>
        {!loading && videos.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-[#94A3B8] text-lg">No videos available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
