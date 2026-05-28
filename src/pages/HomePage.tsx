import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock3, Eye, PlayCircle, Sparkles } from 'lucide-react'
import Skeleton from '../components/ui/Skeleton'
import SEO from '../components/seo/SEO'
import { useArticles, useCategories } from '../hooks/useArticles'
import type { Article } from '../types/article'
import { getArticleDate, getArticleReadingTime, getArticleViews, slugifyCategory } from '../utils/articleUtils'

export default function HomePage() {
  const { data: articles = [], isLoading: loading, error } = useArticles()
  const { data: categories = [] } = useCategories()
  const [activeCategory, setActiveCategory] = useState('All')

  const trendingStories = useMemo(() => articles.filter((a) => a.trending).slice(0, 8), [articles])
  const allFeed = useMemo(() => {
    const list = activeCategory === 'All'
      ? articles
      : articles.filter((a) => a.category === activeCategory)
    return list.slice(0, 14)
  }, [activeCategory, articles])
  const editorPicks = useMemo(() => articles.slice(0, 6), [articles])
  const tutorialStories = useMemo(() => articles.filter((a) => a.type === 'tutorial').slice(0, 4), [articles])
  const videoStories = useMemo(() => articles.filter((a) => a.type === 'video').slice(0, 4), [articles])
  const topics = ['AI', 'React', 'Startups', 'Cybersecurity', 'Productivity', 'Web Development', 'Machine Learning', 'Design', 'Finance']
  const topWriters = useMemo(() => {
    return articles.slice(0, 4).map((article, index) => ({
      name: article.author || `Writer ${index + 1}`,
      bio: `${article.category || 'Technology'} writer`,
      slug: article.slug,
    }))
  }, [articles])
  const trendingList: Article[] = loading ? [] : trendingStories
  const tutorialsList: Article[] = loading ? [] : tutorialStories.slice(0, 3)
  const videosList: Article[] = loading ? [] : videoStories.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#f8f8f7] text-[#171717]">
      <SEO
        title="Gridaan - Editorial AI & Tech Stories"
        description="Discover thoughtful AI, startup, and engineering stories curated for modern readers."
      />

      <section className="border-b border-[#e5e7eb] bg-[#fafaf9]">
        <div className="mx-auto grid max-w-[1260px] grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-12">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-[#737373] uppercase">Gridaan Magazine</p>
            <h1 className="font-serif text-4xl leading-tight text-[#171717] sm:text-5xl md:text-6xl">
              Human stories, ideas & innovation.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#525252] sm:text-lg">
              A place to read, write, and explore the future of technology, startups, AI, culture, and the internet.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/trending"
                className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2a2a2a]"
              >
                Start reading <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-[#d4d4d4] bg-white px-5 py-2.5 text-sm font-medium text-[#262626] transition hover:bg-[#f5f5f2]"
              >
                Start writing
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-[#ececec] bg-white p-6 sm:p-8">
            <div className="space-y-5">
              <div className="h-2 w-20 rounded-full bg-[#e4e9f5]" />
              <div className="h-2 w-40 rounded-full bg-[#ececec]" />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#f5f7fb] p-4">
                  <p className="text-[11px] uppercase tracking-wide text-[#737373]">Editorial</p>
                  <p className="mt-2 font-serif text-lg text-[#171717]">Ideas that travel.</p>
                </div>
                <div className="rounded-2xl bg-[#f8f8f7] p-4">
                  <p className="text-[11px] uppercase tracking-wide text-[#737373]">Technology</p>
                  <p className="mt-2 font-serif text-lg text-[#171717]">Built for readers.</p>
                </div>
              </div>
              <div className="rounded-2xl border border-[#ededed] bg-white px-4 py-3 text-sm text-[#525252]">
                Thoughtful writing for modern builders, creators, and curious minds.
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1260px] grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0">
          <section>
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-serif text-3xl text-[#171717]">Trending stories</h2>
                <p className="mt-1 text-sm text-[#737373]">Voices shaping today&apos;s tech conversation.</p>
              </div>
              <Link to="/trending" className="hidden items-center gap-1 text-sm font-medium text-[#2563eb] hover:text-[#1d4ed8] sm:inline-flex">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="divide-y divide-[#e9e9e9] border-y border-[#ececec]">
              {loading
                ? [...Array(5)].map((_, index) => (
                    <div key={index} className="py-6">
                      <Skeleton className="h-32 rounded-xl" />
                    </div>
                  ))
                : trendingList.map((article) => <EditorialRow key={article.id} article={article} />)}
            </div>
          </section>

          <section className="mt-12">
            <h3 className="font-serif text-2xl text-[#171717]">Editor picks</h3>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {loading
                ? [...Array(4)].map((_, idx) => <Skeleton key={idx} className="h-24 rounded-xl" />)
                : editorPicks.slice(0, 4).map((article) => (
                    <Link key={article.id} to={`/article/${article.slug}`} className="group block border-b border-[#ececec] pb-4">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#737373]">{article.category || 'General'}</p>
                      <h4 className="mt-1 font-serif text-xl leading-snug text-[#171717] transition-colors group-hover:text-[#1d4ed8]">
                        {article.title}
                      </h4>
                      <p className="mt-2 line-clamp-2 text-sm text-[#525252]">{article.excerpt}</p>
                    </Link>
                  ))}
            </div>
          </section>

          <section className="mt-12">
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

            <div className="divide-y divide-[#e9e9e9] border-y border-[#ececec]">
              {loading
                ? [...Array(6)].map((_, idx) => (
                    <div key={idx} className="py-6">
                      <Skeleton className="h-28 rounded-xl" />
                    </div>
                  ))
                : allFeed.map((article) => <EditorialRow key={article.id} article={article} />)}
            </div>
          </section>

          <section className="mt-12 grid gap-10 border-t border-[#ececec] pt-10 sm:grid-cols-2">
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-serif text-2xl text-[#171717]">
                <Sparkles className="h-5 w-5 text-[#2563eb]" />
                Tutorials
              </h3>
              <div className="space-y-4">
                {loading
                  ? [...Array(3)].map((_, index) => <Skeleton key={index} className="h-16 rounded-xl" />)
                  : tutorialsList.map((article) => (
                      <Link key={article.id} to={`/article/${article.slug}`} className="group block border-b border-[#efefef] pb-3">
                        <h4 className="line-clamp-2 text-base font-medium text-[#171717] transition-colors group-hover:text-[#1d4ed8]">
                          {article.title}
                        </h4>
                        <p className="mt-1 text-xs text-[#737373]">{getArticleReadingTime(article)} min read</p>
                      </Link>
                    ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 flex items-center gap-2 font-serif text-2xl text-[#171717]">
                <PlayCircle className="h-5 w-5 text-[#2563eb]" />
                Videos
              </h3>
              <div className="space-y-4">
                {loading
                  ? [...Array(3)].map((_, index) => <Skeleton key={index} className="h-16 rounded-xl" />)
                  : videosList.map((article) => (
                      <Link key={article.id} to={`/article/${article.slug}`} className="group block border-b border-[#efefef] pb-3">
                        <h4 className="line-clamp-2 text-base font-medium text-[#171717] transition-colors group-hover:text-[#1d4ed8]">
                          {article.title}
                        </h4>
                        <p className="mt-1 text-xs text-[#737373]">{getArticleReadingTime(article)} min watch</p>
                      </Link>
                    ))}
              </div>
            </div>
          </section>
        </main>

        <aside className="space-y-10 lg:pt-14">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">Trending topics</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setActiveCategory(topic)}
                  className="rounded-full border border-[#e5e7eb] bg-white px-3 py-1 text-xs text-[#525252] transition hover:bg-[#f5f5f2]"
                >
                  {topic}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">Top writers</h3>
            <div className="mt-3 space-y-4">
              {topWriters.map((writer, idx) => (
                <div key={`${writer.name}-${idx}`} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-xs font-semibold text-[#1d4ed8]">
                    {writer.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#171717]">{writer.name}</p>
                    <p className="text-xs text-[#737373]">{writer.bio}</p>
                  </div>
                  <Link
                    to={`/article/${writer.slug}`}
                    className="ml-auto rounded-full border border-[#e5e7eb] px-3 py-1 text-xs text-[#404040] transition hover:bg-[#f5f5f2]"
                  >
                    Follow
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">Discover categories</h3>
            <div className="mt-3 space-y-2">
              <button
                onClick={() => setActiveCategory('All')}
                className={`w-full rounded-lg px-2 py-2 text-left text-sm transition ${activeCategory === 'All' ? 'text-[#1d4ed8]' : 'text-[#525252] hover:bg-[#f5f5f2]'}`}
              >
                All Stories
              </button>
              {categories.slice(0, 8).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full rounded-lg px-2 py-2 text-left text-sm transition ${activeCategory === cat.name ? 'text-[#1d4ed8]' : 'text-[#525252] hover:bg-[#f5f5f2]'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

function EditorialRow({ article }: { article: Article }) {
  const imageUrl = article.image_url || ''
  const author = article.author || 'Gridaan'
  const category = article.category || 'General'
  const publishedAt = getArticleDate(article)
  const readTime = getArticleReadingTime(article)
  const views = getArticleViews(article)

  const readableDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Recently'

  return (
    <article className="group grid grid-cols-1 gap-4 py-6 sm:grid-cols-[minmax(0,1fr)_170px] sm:gap-6">
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2 text-[11px] text-[#737373]">
          <span className="font-medium text-[#404040]">{author}</span>
          <span>·</span>
          <Link to={`/category/${slugifyCategory(category)}`} className="hover:text-[#1d4ed8]">
            {category}
          </Link>
        </div>
        <Link to={`/article/${article.slug}`}>
          <h3 className="font-serif text-2xl leading-tight text-[#171717] transition-colors group-hover:text-[#1d4ed8] sm:text-[1.75rem]">
            {article.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#525252] sm:text-[15px]">
          {article.excerpt}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#737373]">
          <span>{readableDate}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{readTime} min read</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{views >= 1000 ? `${(views / 1000).toFixed(1)}K` : views}</span>
        </div>
      </div>

      <Link to={`/article/${article.slug}`} className="order-first block aspect-4/3 overflow-hidden rounded-xl bg-[#f1f1ee] sm:order-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={article.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#bdbdbd]">Story</div>
        )}
      </Link>
    </article>
  )
}
