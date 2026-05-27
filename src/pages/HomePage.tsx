import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bookmark, Clock3, Flame, TrendingUp } from 'lucide-react'
import ArticleCard from '../components/articles/ArticleCard'
import Skeleton from '../components/ui/Skeleton'
import SEO from '../components/seo/SEO'
import { useArticles, useCategories } from '../hooks/useArticles'
import { getArticleDate, getArticleReadingTime } from '../utils/articleUtils'

export default function HomePage() {
  const { data: articles = [], isLoading: loading, error } = useArticles()
  const { data: categories = [] } = useCategories()
  const [activeCategory, setActiveCategory] = useState('All')

  const featured = useMemo(() => articles.find((a) => a.featured) ?? articles[0], [articles])
  const trending = useMemo(() => articles.filter((a) => a.trending).slice(0, 5), [articles])
  const latestFeed = useMemo(() => {
    const list = activeCategory === 'All'
      ? articles
      : articles.filter((a) => a.category === activeCategory)
    return list.slice(0, 14)
  }, [activeCategory, articles])

  const formatDate = (value?: string) => {
    if (!value) return 'Recently'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Recently'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-[#f8f8f7]">
      <SEO
        title="Gridaan - Editorial AI & Tech Stories"
        description="Discover thoughtful AI, startup, and engineering stories curated for modern readers."
      />

      <div className="mx-auto grid max-w-[1260px] grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-[#e6e6e6] bg-white p-5">
            <h2 className="text-sm font-semibold text-[#1c1c1c]">Explore</h2>
            <div className="mt-4 space-y-1">
              <button
                onClick={() => setActiveCategory('All')}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${activeCategory === 'All' ? 'bg-[#eef4ff] text-[#1d4ed8]' : 'text-[#4b4b4b] hover:bg-[#f5f5f2]'}`}
              >
                All Stories
              </button>
              {categories.slice(0, 8).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${activeCategory === cat.name ? 'bg-[#eef4ff] text-[#1d4ed8]' : 'text-[#4b4b4b] hover:bg-[#f5f5f2]'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <section className="rounded-2xl border border-[#e6e6e6] bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight text-[#1c1c1c]">Today&apos;s editorial picks</h1>
              <Link to="/trending" className="inline-flex items-center gap-1 text-sm font-medium text-[#1d4ed8] hover:text-[#2563eb]">
                See trending <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {loading ? (
              <Skeleton className="h-[280px] rounded-2xl" />
            ) : featured ? (
              <ArticleCard article={featured} variant="featured" />
            ) : (
              <p className="text-sm text-[#6b6b6b]">No featured story yet.</p>
            )}
          </section>

          <section className="mt-8 rounded-2xl border border-[#e6e6e6] bg-white p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {['All', ...categories.slice(0, 5).map((cat) => cat.name)].map((name) => (
                <button
                  key={name}
                  onClick={() => setActiveCategory(name)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${activeCategory === name ? 'border-[#cfe0ff] bg-[#eef4ff] text-[#1d4ed8]' : 'border-[#e6e6e6] bg-white text-[#555] hover:bg-[#f5f5f2]'}`}
                >
                  {name}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                Unable to load articles right now.
              </div>
            )}

            <div className="divide-y divide-[#efefef]">
              {loading
                ? [...Array(6)].map((_, idx) => <Skeleton key={idx} className="my-4 h-28 rounded-xl" />)
                : latestFeed.map((article) => <ArticleCard key={article.id} article={article} variant="horizontal" />)}
            </div>
          </section>
        </main>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-[#e6e6e6] bg-white p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[#1c1c1c]">
              <TrendingUp className="h-4 w-4 text-[#2563eb]" />
              Trending now
            </h2>
            <div className="mt-4 space-y-4">
              {loading
                ? [...Array(5)].map((_, idx) => <Skeleton key={idx} className="h-14 rounded-lg" />)
                : trending.map((article, index) => (
                    <div key={article.id} className="flex gap-3">
                      <span className="w-5 text-sm font-semibold text-[#b8b8b8]">{index + 1}</span>
                      <div className="min-w-0">
                        <Link to={`/article/${article.slug}`} className="line-clamp-2 text-sm font-medium text-[#1c1c1c] hover:text-[#1d4ed8]">
                          {article.title}
                        </Link>
                        <p className="mt-1 flex items-center gap-2 text-xs text-[#6b6b6b]">
                          <Clock3 className="h-3.5 w-3.5" />
                          {getArticleReadingTime(article)} min · {formatDate(getArticleDate(article))}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#e6e6e6] bg-white p-5">
            <h2 className="text-sm font-semibold text-[#1c1c1c]">Reader shortcuts</h2>
            <div className="mt-3 space-y-2">
              <Link to="/bookmarks" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#4b4b4b] hover:bg-[#f5f5f2]">
                <Bookmark className="h-4 w-4" />
                Saved stories
              </Link>
              <Link to="/tutorials" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#4b4b4b] hover:bg-[#f5f5f2]">
                <Flame className="h-4 w-4" />
                Tutorials
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e6e6e6] bg-white p-5">
            <h2 className="text-sm font-semibold text-[#1c1c1c]">Fresh categories</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.slice(0, 10).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="rounded-full border border-[#e6e6e6] bg-[#fafafa] px-3 py-1 text-xs text-[#555] hover:border-[#d7d7d7]"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
