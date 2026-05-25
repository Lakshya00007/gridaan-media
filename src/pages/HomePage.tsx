import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, Sparkles, Zap, ChevronRight, Play, User } from 'lucide-react';
import ArticleCard from '../components/articles/ArticleCard';
import AdBanner from '../components/ads/AdBanner';
import Skeleton from '../components/ui/Skeleton';
import { useArticles, useCategories } from '../hooks/useArticles';
import { getArticleReadingTime } from '../utils/articleUtils';

export default function HomePage() {
 
  const [activeCategory, setActiveCategory] = useState('All');
  const { data: articles = [], isLoading: loading, error } = useArticles();
  const { data: categories = [] } = useCategories();
  
  const featured = articles.filter(a => a.featured);
  const trending = articles.filter(a => a.trending);
  const latest = articles.slice(0, 9);
  const tutorials = articles.filter(a => a.type === 'tutorial');

  const filteredArticles = activeCategory === 'All'
    ? latest
    : latest.filter(a => a.category === activeCategory);

  const trendingKeywords = ['GPT-5', 'Kubernetes', 'React 20', 'WebAssembly', 'Flutter', 'Cybersecurity', 'MLOps', 'Edge Computing'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-mesh-hero">
        <div className="absolute inset-0 bg-noise opacity-60 pointer-events-none" aria-hidden />
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-indigo-500/20 blur-[100px]" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#14B8A6]/15 blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" aria-hidden />
              <div className="relative flex items-center gap-2 text-[#14B8A6] text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" aria-hidden />
                <span>AI · Technology · Future</span>
              </div>
              <h1 className="text-hero font-bold text-white mb-5 leading-[1.08] tracking-tight">
                Where{' '}
                <span className="relative inline-block">
                  <span className="bg-linear-to-r from-[#2563EB] via-[#6366f1] to-[#14B8A6] bg-clip-text text-transparent">
                    innovation
                  </span>
                </span>{' '}
                meets insight
              </h1>
              <p className="text-base sm:text-lg text-[#64748B] mb-8 max-w-lg leading-relaxed">
                Premium coverage of AI, engineering, and the ideas shaping tomorrow — tutorials, analysis, and breaking tech news.
              </p>
              <div className="flex flex-col xs:flex-row flex-wrap gap-3 mb-8">
                <Link to="/trending" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-xl font-semibold shadow-lg shadow-[#2563EB]/25 hover:shadow-[#2563EB]/40 transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]">
                  <Zap className="w-4 h-4" aria-hidden /> Explore Trending
                </Link>
                <Link to="/tutorials" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0B1224]/40 backdrop-blur-md text-white rounded-xl font-semibold border border-white/10 hover:border-[#14B8A6]/40 hover:bg-[#0B1224]/60 transition-all">
                  <Play className="w-4 h-4" aria-hidden /> Tutorials
                </Link>
                <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[#94A3B8] rounded-xl font-medium border border-white/5 hover:text-white hover:border-white/15 transition-all">
                  <User className="w-4 h-4" aria-hidden /> Dashboard
                </Link>
              </div>
              {/* Stats */}
              <div className="flex gap-8">
                {[
                  { label: 'Articles', value: '342+' },
                  { label: 'Subscribers', value: '24K+' },
                  { label: 'Views', value: '1.2M+' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-[#94A3B8]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Featured Article */}
            {featured[0] && (
              <div className="hidden lg:block">
                <ArticleCard article={featured[0]} variant="featured" />
              </div>
            )}
          </div>

          {/* Trending Keywords */}
          <div className="mt-12 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Trending
            </span>
            {trendingKeywords.map(keyword => (
              <Link key={keyword} to={`/search?q=${keyword}`} className="px-3 py-1.5 bg-[#0B1224]/5 hover:bg-[#0B1224]/10 border border-white/10 text-[#94A3B8] rounded-full text-xs transition-all hover:-translate-y-0.5">
                {keyword}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner position="header" />
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            Unable to load articles right now.
          </div>
        </div>
      )}

      {/* Featured Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#F8FAFC] dark:text-white">Featured Stories</h2>
            <p className="text-[#94A3B8] dark:text-[#94A3B8] mt-1">Hand-picked articles by our editors</p>
          </div>
          <Link to="/trending" className="hidden md:flex items-center gap-1 text-[#2563EB] dark:text-[#94A3B8] font-medium text-sm hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-[320px]" />
              ))
            : featured.slice(0, 3).map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-[#F8FAFC] dark:text-white mb-6">Explore by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {loading
            ? [...Array(5)].map((_, index) => <Skeleton key={index} className="h-28 rounded-xl" />)
            : categories.slice(0, 10).map(cat => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="group p-4 bg-[#0B1224] dark:bg-[#0B1224]/50 rounded-xl border border-[#1E293B]/50 dark:border-[#1E293B]/50 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all hover:-translate-y-1">
                  <span className="text-2xl mb-2 block">{cat.icon}</span>
                  <h3 className="font-semibold text-sm text-[#F8FAFC] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-[#94A3B8] transition-colors">{cat.name}</h3>
                  <span className="text-xs text-[#94A3B8]">{cat.count} articles</span>
                </Link>
              ))}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2">
            {/* Category Filters */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {['All', ...categories.slice(0, 5).map(cat => cat.name)].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/20 dark:shadow-[#1D4ED8]/30'
                      : 'bg-[#0B1224] dark:bg-[#0B1224] text-gray-600 dark:text-[#94A3B8] hover:bg-[#0B1224]/80 dark:hover:bg-[#0B1224]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-[#F8FAFC] dark:text-white mb-6">Latest Articles</h2>
            
            <div className="space-y-0">
              {loading ? (
                [...Array(4)].map((_, index) => (
                  <div key={index} className="flex flex-col gap-4 py-4 border-b border-[#1E293B] dark:border-[#1E293B] last:border-0">
                    <Skeleton className="h-24 w-full rounded-[1.25rem]" />
                  </div>
                ))
              ) : (
                (filteredArticles.length > 0 ? filteredArticles : latest).map((article, index) => (
                  <div key={article.id}>
                    <ArticleCard article={article} variant="horizontal" />
                    {index === 2 && <div className="py-4"><AdBanner position="in-article" /></div>}
                  </div>
                ))
              )}
            </div>

            <Link to="/trending" className="mt-8 block text-center py-3 bg-[#0B1224] rounded-xl text-sm font-medium text-[#94A3B8] hover:bg-[#080d1a]/80 ring-1 ring-white/5 hover:ring-[#2563EB]/30 transition-all">
              Load More Articles →
            </Link>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Trending Widget */}
            <div className="bg-[#0B1224] dark:bg-[#0B1224]/50 rounded-2xl border border-[#1E293B]/50 dark:border-[#1E293B]/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-[#F8FAFC] dark:text-white">Trending Now</h3>
              </div>
              <div className="space-y-0">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-3 py-3 border-b border-[#1E293B] dark:border-[#1E293B] last:border-0">
                      <Skeleton className="h-8 w-8 rounded-2xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                  ))
                ) : (
                  trending.slice(0, 5).map((article, i) => (
                    <div key={article.id} className="flex gap-3 py-3 border-b border-[#1E293B] dark:border-[#1E293B] last:border-0">
                      <span className="text-2xl font-bold text-gray-200 dark:text-gray-700 shrink-0 w-8">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <Link to={`/article/${article.slug}`} className="text-sm font-medium text-[#F8FAFC] dark:text-white hover:text-[#2563EB] dark:hover:text-[#94A3B8] transition-colors line-clamp-2">
                          {article.title}
                        </Link>
                        <span className="text-xs text-[#94A3B8] mt-0.5 block">{getArticleReadingTime(article)} min read</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Ad */}
            <AdBanner position="sidebar" />

            {/* Tutorials Widget */}
            <div className="bg-[#0B1224] dark:bg-[#0B1224]/50 rounded-2xl border border-[#1E293B]/50 dark:border-[#1E293B]/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#F8FAFC] dark:text-white">📚 Tutorials</h3>
                <Link to="/tutorials" className="text-xs text-[#2563EB] dark:text-[#94A3B8] font-medium">View all →</Link>
              </div>
              {tutorials.slice(0, 4).map(article => (
                <ArticleCard key={article.id} article={article} variant="compact" />
              ))}
            </div>

            {/* Newsletter Mini */}
            <div className="bg-linear-to-br from-[#2563EB] to-[#1D4ED8] rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">📬 Weekly Newsletter</h3>
              <p className="text-sm text-[#94A3B8] mb-4">Get the best articles delivered to your inbox every week.</p>
              <Link to="/" className="block text-center py-2.5 bg-[#0B1224] text-[#2563EB] rounded-xl text-sm font-semibold hover:bg-[#0B1224] transition-colors">
                Subscribe Free
              </Link>
              <p className="text-xs text-[#94A3B8] mt-2 text-center">Join 24,680+ subscribers</p>
            </div>

            {/* Tags Cloud */}
            <div className="bg-[#0B1224] dark:bg-[#0B1224]/50 rounded-2xl border border-[#1E293B]/50 dark:border-[#1E293B]/50 p-6">
              <h3 className="font-bold text-[#F8FAFC] dark:text-white mb-4">🏷️ Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'AI', 'Python', 'JavaScript', 'Docker', 'AWS', 'TypeScript', 'Node.js', 'Kubernetes', 'GraphQL', 'Rust', 'Go', 'DevOps', 'Security'].map(tag => (
                  <Link key={tag} to={`/search?q=${tag}`} className="px-3 py-1.5 bg-[#0B1224] dark:bg-[#0B1224] text-gray-600 dark:text-[#94A3B8] rounded-full text-xs font-medium hover:bg-[#0B1224] hover:text-[#2563EB] dark:hover:bg-[#0B1224]/30 dark:hover:text-[#94A3B8] transition-colors">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Featured Tutorials Section */}
      <section className="bg-[#0B1224] dark:bg-[#0B1224]/50 py-12 border-y border-[#1E293B]/50 dark:border-[#1E293B]/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#F8FAFC] dark:text-white">Popular Tutorials</h2>
              <p className="text-[#94A3B8] dark:text-[#94A3B8] mt-1">Learn with step-by-step guides</p>
            </div>
            <Link to="/tutorials" className="hidden md:flex items-center gap-1 text-[#2563EB] dark:text-[#94A3B8] font-medium text-sm hover:gap-2 transition-all">
              All tutorials <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tutorials.slice(0, 4).map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Ad */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AdBanner position="footer" />
      </div>
    </div>
  );
}
