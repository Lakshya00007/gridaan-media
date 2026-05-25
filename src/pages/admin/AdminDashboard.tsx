import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import ArticleForm from '../../components/admin/ArticleForm'
import ArticleList from '../../components/admin/ArticleList'
import DashboardStats from '../../components/admin/DashboardStats'
import QuickActions from '../../components/admin/QuickActions'
import RecentActivity from '../../components/admin/RecentActivity'
import { createArticle, deleteArticle, updateArticle, type ArticlePayload } from '../../services/articles'
import type { Article } from '../../types/article'
import { articleKeys, useArticles } from '../../hooks/useArticles'
import { sanitizeHtml } from '../../utils/sanitize'
import { signOut } from '../../lib/auth'
import { useAuthUser } from '../../hooks/useAuthUser'
import { useNotifications } from '../../context/NotificationContext'

const categories = ['Technology', 'AI', 'Web Development', 'Business', 'Culture', 'Tutorial']

export default function AdminDashboard() {
  const queryClient = useQueryClient()
  const { user, profile, loading, isAdmin } = useAuthUser()
  const { addNotification } = useNotifications()
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const {
    data: articles = [],
    isLoading: articlesLoading,
    isFetching: articlesFetching,
    error: articlesError,
    refetch: refetchArticles,
  } = useArticles()
  const navigate = useNavigate()
  const loadingArticles = articlesLoading || articlesFetching || deleting

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login', { replace: true })
      return
    }
    if (profile && !isAdmin) {
      navigate('/', { replace: true })
    }
  }, [loading, user, profile, isAdmin, navigate])

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const handleSave = async (article: ArticlePayload & { id?: string }) => {
    setSaving(true)
    setError('')

    try {
      const sanitizedArticle = {
        ...article,
        content: sanitizeHtml(article.content || ''),
      }
      const { id, ...payload } = sanitizedArticle

      if (id) {
        await updateArticle(id, payload)
        toast.success('Article updated successfully.')
        addNotification({
          type: 'admin_update',
          title: 'Article updated',
          message: payload.title,
          href: `/article/${payload.slug}`,
        })
      } else {
        await createArticle(payload)
        toast.success('Article published successfully.')
        addNotification({
          type: 'article_published',
          title: 'New article live',
          message: payload.title,
          href: `/article/${payload.slug}`,
        })
      }
      setSelectedArticle(null)
      await queryClient.invalidateQueries({ queryKey: articleKeys.all })
    } catch {
      const message = 'Unable to save the article. Please try again.'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this article permanently?')) return
    setError('')
    setDeleting(true)
    try {
      await deleteArticle(id)
      toast.success('Article deleted successfully.')
      await queryClient.invalidateQueries({ queryKey: articleKeys.all })
    } catch {
      const message = 'Unable to delete the article. Please try again.'
      setError(message)
      toast.error(message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading || !user || !profile || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#080d1a] text-slate-100 flex items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-[#0B1224]/90 px-8 py-6 text-center shadow-2xl">
          <p className="text-lg font-medium">Verifying admin session…</p>
        </div>
      </div>
    )
  }

  const currentUser = user.email ?? 'Admin'

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.12),transparent)]" aria-hidden />
      <Toaster position="bottom-right" />
      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:py-8 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0B1224]/80 p-6 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#14B8A6]">Editorial CMS</p>
            <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Gridaan Dashboard</h1>
            <p className="mt-1 text-sm text-[#64748B]">Publish, analyze, and manage your AI-tech publication.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-xl border border-white/10 bg-[#080d1a]/80 px-4 py-2 text-sm text-[#94A3B8]">
              {currentUser}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-500"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </header>

        {(error || articlesError) && (
          <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            {error || 'Unable to fetch articles. Please refresh.'}
          </div>
        )}

        <DashboardStats articles={articles} />

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_280px] 2xl:grid-cols-[1fr_300px]">
          <div className="min-w-0 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0B1224]/80 p-4 sm:p-6 backdrop-blur-sm">
              <ArticleForm
                article={selectedArticle ?? undefined}
                author={currentUser}
                categories={categories}
                saving={saving}
                onSave={handleSave}
                onCancel={() => setSelectedArticle(null)}
              />
            </div>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <QuickActions
              onNew={() => setSelectedArticle(null)}
              onRefresh={() => refetchArticles()}
            />
            <RecentActivity articles={articles} />
          </aside>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0B1224]/80 p-4 sm:p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">Article library</h2>
          <ArticleList
            articles={articles}
            loading={loadingArticles}
            onEdit={setSelectedArticle}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  )
}
