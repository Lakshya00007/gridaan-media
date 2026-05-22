import { Link } from 'react-router-dom';
import { Play, Clock, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AdBanner from '../components/ads/AdBanner';

export default function VideosPage() {
  const { articles } = useApp();

  // Use all articles as video content for demo
  const videos = articles.slice(0, 8);

  return (
    <div className="min-h-screen">
      <div className="bg-linear-to-br from-[#327CFA] via-[#0A1222] to-[#0B1224] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🎬 Videos</h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Watch tutorials, tech talks, and expert discussions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdBanner position="header" className="mb-8" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(article => (
            <Link key={article.id} to={`/article/${article.slug}`} className="group bg-[#0B1224] dark:bg-[#0B1224]/50 rounded-2xl overflow-hidden border border-[#1E293B]/50 dark:border-[#1E293B]/50 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="relative aspect-video overflow-hidden">
                <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 bg-[#0B1224]/90 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-[#F8FAFC] ml-1" fill="currentColor" />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs rounded font-mono">
                  {article.readingTime}:00
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#F8FAFC] dark:text-white group-hover:text-[#327CFA] dark:group-hover:text-[#94A3B8] transition-colors line-clamp-2 mb-2">
                  {article.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                  <span>{article.author.name}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(article.views / 1000).toFixed(1)}K</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readingTime}m</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
