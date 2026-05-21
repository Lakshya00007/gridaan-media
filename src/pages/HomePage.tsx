import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, Sparkles, Zap, ChevronRight, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/mockData';
import ArticleCard from '../components/articles/ArticleCard';
import AdBanner from '../components/ads/AdBanner';

export default function HomePage() {
  const { articles } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  
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
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Text */}
            <div>
              <div className="flex items-center gap-2 text-indigo-300 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Discover the latest in technology</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.1]">
                Where <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">innovation</span> meets insight
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
                Expert articles, in-depth tutorials, and breaking news from the world of technology. Join 24,000+ subscribers staying ahead.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link to="/trending" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5">
                  <Zap className="w-4 h-4" /> Explore Trending
                </Link>
                <Link to="/tutorials" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/10">
                  <Play className="w-4 h-4" /> Watch Tutorials
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
                    <div className="text-xs text-gray-400">{stat.label}</div>
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
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Trending
            </span>
            {trendingKeywords.map(keyword => (
              <Link key={keyword} to={`/search?q=${keyword}`} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-full text-xs transition-all hover:-translate-y-0.5">
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

      {/* Featured Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Featured Stories</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Hand-picked articles by our editors</p>
          </div>
          <Link to="/trending" className="hidden md:flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.slice(0, 3).map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Explore by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.slice(0, 10).map(cat => (
            <Link key={cat.id} to={`/category/${cat.slug}`} className="group p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all hover:-translate-y-1">
              <span className="text-2xl mb-2 block">{cat.icon}</span>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{cat.name}</h3>
              <span className="text-xs text-gray-500">{cat.count} articles</span>
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
              {['All', 'Technology', 'AI & Machine Learning', 'Programming', 'Web Development', 'Cloud Computing'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Latest Articles</h2>
            
            <div className="space-y-0">
              {(filteredArticles.length > 0 ? filteredArticles : latest).map((article, index) => (
                <div key={article.id}>
                  <ArticleCard article={article} variant="horizontal" />
                  {index === 2 && <div className="py-4"><AdBanner position="in-article" /></div>}
                </div>
              ))}
            </div>

            <Link to="/trending" className="mt-8 block text-center py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Load More Articles →
            </Link>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Trending Widget */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">Trending Now</h3>
              </div>
              <div className="space-y-0">
                {trending.slice(0, 5).map((article, i) => (
                  <div key={article.id} className="flex gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-2xl font-bold text-gray-200 dark:text-gray-700 shrink-0 w-8">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <Link to={`/article/${article.slug}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">
                        {article.title}
                      </Link>
                      <span className="text-xs text-gray-500 mt-0.5 block">{article.readingTime} min read</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad */}
            <AdBanner position="sidebar" />

            {/* Tutorials Widget */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">📚 Tutorials</h3>
                <Link to="/tutorials" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">View all →</Link>
              </div>
              {tutorials.slice(0, 4).map(article => (
                <ArticleCard key={article.id} article={article} variant="compact" />
              ))}
            </div>

            {/* Newsletter Mini */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">📬 Weekly Newsletter</h3>
              <p className="text-sm text-indigo-100 mb-4">Get the best articles delivered to your inbox every week.</p>
              <Link to="/" className="block text-center py-2.5 bg-white text-indigo-600 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors">
                Subscribe Free
              </Link>
              <p className="text-xs text-indigo-200 mt-2 text-center">Join 24,680+ subscribers</p>
            </div>

            {/* Tags Cloud */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">🏷️ Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'AI', 'Python', 'JavaScript', 'Docker', 'AWS', 'TypeScript', 'Node.js', 'Kubernetes', 'GraphQL', 'Rust', 'Go', 'DevOps', 'Security'].map(tag => (
                  <Link key={tag} to={`/search?q=${tag}`} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Featured Tutorials Section */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-12 border-y border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Popular Tutorials</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Learn with step-by-step guides</p>
            </div>
            <Link to="/tutorials" className="hidden md:flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:gap-2 transition-all">
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
