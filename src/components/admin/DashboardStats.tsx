import { Bookmark, Eye, FileText, Flame, Calendar } from 'lucide-react'
import StatCard from '../ui/StatCard'
import type { Article } from '../../types/article'
import { getArticleViews } from '../../utils/articleUtils'

interface DashboardStatsProps {
  articles: Article[]
}

export default function DashboardStats({ articles }: DashboardStatsProps) {
  const totalViews = articles.reduce((sum, a) => sum + getArticleViews(a), 0)
  const published = articles.filter((a) => (a.status ?? 'published') === 'published')
  const today = new Date().toDateString()
  const publishedToday = published.filter(
    (a) => a.created_at && new Date(a.created_at).toDateString() === today
  ).length
  const trending = articles.filter((a) => a.trending).length

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
      <StatCard label="Total Articles" value={articles.length} icon={FileText} />
      <StatCard
        label="Total Views"
        value={totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews}
        icon={Eye}
      />
      <StatCard label="Bookmarks" value="—" icon={Bookmark} trend="Reader engagement" />
      <StatCard label="Published Today" value={publishedToday} icon={Calendar} />
      <StatCard label="Trending Posts" value={trending} icon={Flame} className="col-span-2 sm:col-span-1" />
    </div>
  )
}
