import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, Sparkles, Zap, ChevronRight, Play, BookOpen, Clock, Eye, Mail, Star } from 'lucide-react';
import { MotionContainer, MotionItem } from '../components/ui/MotionPresets';
import ArticleCard from '../components/articles/ArticleCard';
import AdBanner from '../components/ads/AdBanner';
import Skeleton from '../components/ui/Skeleton';
import SEO from '../components/seo/SEO';
import { Button } from '../components/ui';
import LazyImage from '../components/ui/LazyImage';
import { useArticles, useCategories } from '../hooks/useArticles';
import { getArticleReadingTime, getArticleViews, getArticleDate } from '../utils/articleUtils';
import { useUI } from '../context/UIContext';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { data: articles = [], isLoading: loading, error } = useArticles();
  const { data: categories = [] } = useCategories();
  const { newsletterEmail, setNewsletterEmail, subscribed, subscribe, subscriberCount } = useUI();
  
  const featured = articles.filter(a => a.featured);
  const trending = articles.filter(a => a.trending);
  const latest = articles.slice(0, 9);
  const tutorials = articles.filter(a => a.type === 'tutorial');
  const videos = articles.filter(a => a.type === 'video');

  const filteredArticles = activeCategory === 'All'
    ? latest
    : latest.filter(a => a.category === activeCategory);

  const trendingKeywords = ['GPT-5', 'Next.js 15', 'Kubernetes', 'WebAssembly', 'Cybersecurity', 'Rust', 'MLOps', 'Vector DBs'];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      subscribe(newsletterEmail);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SEO 
        title="Gridaan - Premium Digital Publishing Platform"
        description="Gridaan is a modern editorial publishing platform featuring technology news, expert tutorials, AI breakthroughs, and digital media insights."
      />

      {/* HERO */}
      <section className="pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider mb-4">
                <Sparkles className="w-4 h-4" />
                Curated · In-depth · Practical
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight leading-tight text-text max-w-2xl">
                Insightful reporting and practical engineering guides for the modern web
              </h1>
              <p className="mt-4 text-base text-text-secondary max-w-xl leading-relaxed">
                Deep investigations, tutorials, and perspectives on AI, developer tooling, and distributed systems — crafted for engineers and leaders who build the future.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 items-center">
                <Link to="/trending" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-hover-blue transition">Explore Trending</Link>
                <Link to="/tutorials" className="inline-flex items-center gap-2 px-4 py-2 bg-card text-text rounded-lg border border-border hover:border-primary transition">Browse Tutorials</Link>
                <span className="ml-3 text-sm text-text-secondary hidden md:inline">· Updated weekly</span>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
                <div>
                  <div className="text-lg font-bold text-text">450+</div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider">Articles</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-text">24K+</div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider">Subscribers</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-text">1.2M+</div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider">Monthly readers</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -right-6 -top-6 w-[420px] h-[420px] rounded-3xl bg-gradient-to-tr from-primary/10 to-cyan-200/5 blur-3xl opacity-80 pointer-events-none" />
                <div className="rounded-3xl overflow-hidden border border-border shadow-md">
                  {loading ? (
                    <Skeleton className="h-[420px] rounded-3xl" />
                  ) : featured[0] ? (
                    <div className="p-4 sm:p-6">
                      <ArticleCard article={featured[0]} variant="featured" />
                    </div>
                  ) : (
                    <div className="h-[360px] flex items-center justify-center text-text-secondary">No featured article</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-primary" /> Hot Topics:
            </span>
            {trendingKeywords.map(keyword => (
              <Link 
                key={keyword} 
                to={`/search?q=${keyword}`} 
                className="px-3 py-1 bg-card hover:bg-primary/5 border border-border hover:border-primary/30 text-text-secondary hover:text-primary rounded-full text-[10px] font-semibold transition-all"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8-COLS: Main Editorial Stream */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* SECTION 1: Featured Stories */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h2 className="text-lg font-bold text-text">Featured Stories</h2>
                  <p className="text-xs text-text-secondary">Curated deep-dives from our editors</p>
                </div>
                <Link to="/trending" className="flex items-center gap-1 text-primary text-xs font-bold hover:gap-1.5 transition-all">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              
              <MotionContainer className="grid md:grid-cols-2 gap-6">
                {loading ? (
                  [...Array(2)].map((_, i) => <Skeleton key={i} className="h-80 rounded-3xl" />)
                ) : (
                  featured.slice(1, 3).map(article => (
                    <MotionItem key={article.id} className="">
                      <ArticleCard article={article} />
                    </MotionItem>
                  ))
                )}
              </MotionContainer>
            </section>

            {/* Ad Banner */}
            <div className="py-2">
              <AdBanner position="header" />
            </div>

            {/* SECTION 3: Latest Tutorials */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h2 className="text-lg font-bold text-text">Latest Tutorials</h2>
                  <p className="text-xs text-text-secondary">Learn step-by-step with expert engineering guides</p>
                </div>
                <Link to="/tutorials" className="flex items-center gap-1 text-primary text-xs font-bold hover:gap-1.5 transition-all">
                  Browse guides <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {loading ? (
                  [...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
                ) : (
                  tutorials.slice(0, 4).map(article => (
                    <ArticleCard key={article.id} article={article} variant="horizontal" />
                  ))
                )}
              </div>
            </section>

            {/* SECTION 4: Videos Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h2 className="text-lg font-bold text-text">🎥 Featured Broadcasts</h2>
                  <p className="text-xs text-text-secondary">Video tutorials, talks, and tech analyses</p>
                </div>
                <Link to="/videos" className="flex items-center gap-1 text-primary text-xs font-bold hover:gap-1.5 transition-all">
                  Watch all videos <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {loading ? (
                  [...Array(2)].map((_, i) => <Skeleton key={i} className="h-[220px] rounded-3xl" />)
                ) : videos.length === 0 ? (
                  <div className="col-span-2 text-center py-6 text-xs text-text-secondary">No videos available yet</div>
                ) : (
                  videos.slice(0, 2).map(article => (
                    <Link 
                      key={article.id} 
                      to={`/article/${article.slug}`} 
                      className="group bg-card border border-border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all hover:-translate-y-1 block"
                    >
                      <div className="relative aspect-video bg-bg overflow-hidden border-b border-border/50">
                        {article.image_url ? (
                          <LazyImage
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-cyan-500" />
                        )}
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/35 transition-colors">
                          <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/85 text-white text-[10px] rounded font-semibold font-mono">
                          {getArticleReadingTime(article)}:00
                        </span>
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold text-sm text-text group-hover:text-primary transition-colors line-clamp-1 leading-snug mb-1">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-text-secondary font-medium">
                          <span>{article.author || 'Admin'}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{getArticleViews(article)} views</span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>

            {/* SECTION 5: Dynamic Filtering Stream */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
                <div>
                  <h2 className="text-lg font-bold text-text">Latest Feed</h2>
                  <p className="text-xs text-text-secondary font-medium">Filtered publication list</p>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide max-w-full">
                  {['All', ...categories.slice(0, 4).map(c => c.name)].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap border cursor-pointer ${
                        activeCategory === cat
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-card text-text-secondary border-border hover:bg-bg hover:text-text'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                {loading ? (
                  [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-3xl" />)
                ) : filteredArticles.length === 0 ? (
                  <div className="text-center py-12 text-xs text-text-secondary">No articles found in this filter</div>
                ) : (
                  <MotionContainer className="space-y-2">
                    {filteredArticles.map(article => (
                      <MotionItem key={article.id}>
                        <ArticleCard article={article} variant="horizontal" />
                      </MotionItem>
                    ))}
                  </MotionContainer>
                )}
              </div>
            </section>

          </div>

          {/* RIGHT 4-COLS: Widgets and Sidebars */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-20">
            
            {/* SECTION 7: Popular This Week (Side Rank List) */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 border-b border-border pb-2.5">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <h3 className="font-bold text-sm text-text">Popular This Week</h3>
              </div>
              <div className="space-y-4">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-bg" />
                      <div className="flex-1 space-y-1.5 py-0.5">
                        <div className="h-3 bg-bg rounded w-5/6" />
                        <div className="h-2 bg-bg rounded w-1/3" />
                      </div>
                    </div>
                  ))
                ) : trending.length === 0 ? (
                  <div className="text-xs text-text-secondary py-2">No trending stories found</div>
                ) : (
                  trending.slice(0, 5).map((article, index) => (
                    <div key={article.id} className="flex gap-3 items-start group">
                      <span className="text-xl font-extrabold text-primary/20 shrink-0 w-6 leading-none">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <Link 
                          to={`/article/${article.slug}`} 
                          className="text-xs font-bold text-text group-hover:text-primary transition-colors line-clamp-2 leading-snug"
                        >
                          {article.title}
                        </Link>
                        <span className="text-[10px] text-text-secondary mt-1 block">
                          {formatDate(getArticleDate(article))} · {getArticleReadingTime(article)} min read
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* SECTION 6: Categories Grid Widget */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 border-b border-border pb-2.5">
                <h3 className="font-bold text-sm text-text">Explore Topics</h3>
                <Link to="/categories" className="text-[10px] text-primary font-bold hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {loading ? (
                  [...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)
                ) : (
                  categories.slice(0, 6).map(cat => (
                    <Link 
                      key={cat.id} 
                      to={`/category/${cat.slug}`}
                      className="p-3 bg-bg border border-border/80 hover:border-primary/30 rounded-2xl flex flex-col items-center text-center hover:bg-primary/5 transition-all duration-200"
                    >
                      <span className="text-lg mb-1">{cat.icon}</span>
                      <span className="text-[10px] font-bold text-text truncate w-full">{cat.name}</span>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Sidebar Ad Panel */}
            <AdBanner position="sidebar" />

            {/* SECTION 5: Newsletter Inline CTA Widget */}
            <div className="bg-gradient-to-br from-primary/5 to-cyan-500/5 border border-primary/10 rounded-3xl p-6 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
              <h3 className="font-bold text-sm text-text mb-1">📬 Weekly Newsletter</h3>
              <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                Stay updated with the best hand-picked technology insights.
              </p>
              
              {subscribed ? (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-[11px] text-primary font-semibold text-center">
                  ✅ Subscribed! Thanks for joining.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-[11px] text-text placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    required
                  />
                  <Button type="submit" variant="primary" size="md" className="w-full">Subscribe Free</Button>
                </form>
              )}
              <p className="text-[10px] text-text-secondary mt-2 text-center">
                Join {subscriberCount.toLocaleString()}+ developers & engineers.
              </p>
            </div>

            {/* Tags Cloud */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xs">
              <h3 className="font-bold text-sm text-text mb-3 border-b border-border pb-2.5">Popular Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {['React', 'AI', 'Python', 'JavaScript', 'Docker', 'AWS', 'TypeScript', 'Node.js', 'Rust', 'DevOps'].map(tag => (
                  <Link 
                    key={tag} 
                    to={`/search?q=${tag}`} 
                    className="px-2.5 py-1 bg-bg border border-border/80 text-text-secondary hover:text-primary hover:border-primary/30 rounded-full text-[10px] font-semibold transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </div>

    </div>
  );
}
