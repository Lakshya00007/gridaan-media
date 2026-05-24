import type { Article } from '../../types/article'
import Skeleton from '../ui/Skeleton'

interface ArticleListProps {
  articles: Article[]
  loading: boolean
  onEdit: (article: Article) => void
  onDelete: (id: string) => void
}

const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}) : 'Recently'

export default function ArticleList({ articles, loading, onEdit, onDelete }: ArticleListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-700 bg-[#0B1224]/80 p-6 text-slate-400">
        No articles yet. Start by creating your first post.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {articles.map(article => (
        <div key={article.id} className="rounded-3xl border border-slate-700 bg-[#0B1224]/80 p-4 shadow-xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              {article.image_url ? (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="h-20 w-28 rounded-3xl object-cover"
                />
              ) : (
                <div className="h-20 w-28 rounded-3xl bg-linear-to-br from-[#0F172A] to-[#2563EB]" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">{article.title}</h3>
                <p className="text-sm text-slate-400">{article.category || 'General'}</p>
                <p className="text-xs text-slate-500">{formatDate(article.created_at)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onEdit(article)}
                className="rounded-2xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2563EB]"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(article.id)}
                className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
