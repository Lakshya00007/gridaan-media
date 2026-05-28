import { Link } from 'react-router-dom'
import { Play, Clock, Eye } from 'lucide-react'
import AdBanner from '../components/ads/AdBanner'
import Skeleton from '../components/ui/Skeleton'
import SEO from '../components/seo/SEO'
import PageHero from '../components/layout/PageHero'
import { useVideoArticles } from '../hooks/useArticles'
import { getArticleReadingTime, getArticleViews } from '../utils/articleUtils'

export default function VideosPage() {
  const { data: videos = [], isLoading: loading, error } = useVideoArticles()

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SEO 
        title="Featured Broadcasts"
        description="Watch software engineering workshops, machine learning roundtables, and live tutorials."
      />
      <PageHero
        title="Videos"
        description="Watch tutorials, tech talks, and expert discussions."
        className="text-center"
        compact
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdBanner position="header" className="mb-8" />
        {error && (
          <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
            Unable to load videos right now.
          </div>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [...Array(6)].map((_, index) => <Skeleton key={index} className="h-[300px]" />)
            : videos.map((article) => {
                const readingTime = getArticleReadingTime(article)
                const views = getArticleViews(article)
                return (
                  <Link
                    key={article.id}
                    to={`/article/${article.slug}`}
                    className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-md transition-all hover:-translate-y-1 flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    <div className="relative aspect-video overflow-hidden bg-bg border-b border-border/50">
                      {article.image_url ? (
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#f5f5f2]" />
                      )}
                      <div className="absolute inset-0 bg-black/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-border">
                          <Play className="w-5 h-5 text-primary fill-primary ml-0.5" aria-hidden />
                        </div>
                      </div>
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 text-white text-[10px] rounded font-semibold font-mono">
                        {readingTime}:00
                      </span>
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <h3 className="font-bold text-sm text-text group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] text-text-secondary font-medium mt-auto">
                        <span className="font-bold text-text">{article.author || 'Admin'}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <Eye className="w-3 h-3" aria-hidden />
                          {(views / 1000).toFixed(1)}K views
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" aria-hidden />
                          {readingTime}m read
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
        </div>
        {!loading && videos.length === 0 && !error && (
          <div className="text-center py-20 bg-card rounded-2xl border border-border p-8 shadow-sm max-w-md mx-auto">
            <p className="text-text-secondary text-xs">No videos available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
