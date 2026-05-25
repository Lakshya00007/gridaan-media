import { formatDistanceToNow } from 'date-fns'
import { FileEdit, MessageSquare } from 'lucide-react'
import type { Article } from '../../types/article'

interface RecentActivityProps {
  articles: Article[]
}

export default function RecentActivity({ articles }: RecentActivityProps) {
  const recent = [...articles]
    .sort(
      (a, b) =>
        new Date(b.created_at ?? 0).getTime() -
        new Date(a.created_at ?? 0).getTime()
    )
    .slice(0, 5)

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1224]/90 p-5 backdrop-blur-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#64748B]">
        Recent activity
      </h3>
      <ul className="mt-4 space-y-3">
        {recent.length === 0 ? (
          <li className="text-sm text-[#64748B]">No activity yet.</li>
        ) : (
          recent.map((article) => (
            <li key={article.id} className="flex gap-3 text-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/15 text-[#2563EB]">
                <FileEdit className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-white line-clamp-1">{article.title}</p>
                <p className="text-xs text-[#64748B]">
                  {(article.status ?? 'published') === 'draft' ? 'Draft' : 'Published'}
                  {article.created_at &&
                    ` · ${formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}`}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <MessageSquare className="h-4 w-4" />
          <span>Comments panel — connect moderation in a future release.</span>
        </div>
      </div>
    </div>
  )
}
