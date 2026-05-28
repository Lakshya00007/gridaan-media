import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { Article } from '../../types/article'
import Skeleton from '../ui/Skeleton'

interface ArticleListProps {
  articles: Article[]
  loading: boolean
  onEdit: (article: Article) => void
  onDelete: (id: string) => void
}

type Tab = 'all' | 'published' | 'draft'

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recently'

function StatusBadge({ status }: { status?: string }) {
  const s = status ?? 'published'
  const styles =
    s === 'draft'
      ? 'bg-amber-100 text-amber-800 ring-amber-200'
      : s === 'scheduled'
        ? 'bg-indigo-100 text-indigo-800 ring-indigo-200'
        : 'bg-emerald-100 text-emerald-800 ring-emerald-200'

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${styles}`}
    >
      {s}
    </span>
  )
}

export default function ArticleList({
  articles,
  loading,
  onEdit,
  onDelete,
}: ArticleListProps) {
  const [tab, setTab] = useState<Tab>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    let list = articles
    if (tab === 'published') {
      list = list.filter((a) => (a.status ?? 'published') === 'published')
    } else if (tab === 'draft') {
      list = list.filter((a) => (a.status ?? 'published') === 'draft')
    }
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.category ?? '').toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q)
    )
  }, [articles, tab, query])

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-xl border border-border bg-[#fafaf9] p-1">
          {(['all', 'published', 'draft'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                tab === t
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="w-full rounded-xl border border-border bg-white py-2 pl-9 pr-3 text-sm text-text placeholder-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-56"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-6 text-text-secondary text-sm shadow-sm">
          No articles match your filters.
        </div>
      ) : (
        <div className="space-y-3 max-h-[min(70vh,32rem)] overflow-y-auto overscroll-contain pr-1">
          {filtered.map((article) => (
            <div
              key={article.id}
              className="rounded-2xl border border-border bg-white p-4 shadow-sm transition hover:border-primary/30"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt=""
                    loading="lazy"
                    className="h-20 w-full rounded-xl object-cover sm:h-20 sm:w-28"
                  />
                ) : (
                  <div className="h-20 w-full rounded-xl bg-[#f5f5f2] border border-border sm:w-28" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-text line-clamp-1">
                      {article.title}
                    </h3>
                    <StatusBadge status={article.status} />
                  </div>
                  <p className="text-sm text-text-secondary">{article.category || 'General'}</p>
                  <p className="text-xs text-text-secondary">{formatDate(article.created_at)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(article)}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(article.id)}
                    className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
