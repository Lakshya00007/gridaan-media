import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, RefreshCcw, LogOut } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import ArticleForm from '../../components/admin/ArticleForm'
import ArticleList from '../../components/admin/ArticleList'
import { createArticle, deleteArticle, updateArticle, type ArticlePayload } from '../../services/articles'
import type { Article } from '../../types/article'
import { articleKeys, useArticles } from '../../hooks/useArticles'
import { sanitizeHtml } from '../../utils/sanitize'
import { signOut } from '../../lib/auth'
import { useAuthUser } from '../../hooks/useAuthUser'

const categories = ['Technology', 'AI', 'Web Development', 'Business', 'Culture', 'Tutorial']

export default function AdminDashboard() {
  const queryClient = useQueryClient()
  const { user, profile, loading, isAdmin } = useAuthUser()
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
      } else {
        await createArticle(payload)
        toast.success('Article published successfully.')
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
    const confirmed = window.confirm('Delete this article permanently?')
    if (!confirmed) {
      return
    }

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
      <div className="min-h-screen bg-[#060A16] text-slate-100 flex items-center justify-center">
        <div className="rounded-3xl border border-slate-700 bg-[#0B1224]/90 px-8 py-6 text-center shadow-2xl shadow-slate-950/30">
          <p className="text-lg font-medium">Verifying admin session…</p>
        </div>
      </div>
    )
  }

  const currentUser = user.email ?? 'Admin'

  return (
    <div className="min-h-screen bg-[#060A16] text-slate-100">
      <Toaster position="bottom-right" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-700 bg-[#0B1224]/90 p-6 shadow-xl shadow-slate-950/40 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#94A3B8]/80">Gridaan Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">CMS Dashboard</h1>
            <p className="mt-2 text-sm text-slate-400">Manage articles, upload thumbnails, and publish directly to Supabase.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-3xl bg-[#060A16]/80 px-4 py-3 text-sm text-slate-300">
              Signed in as <span className="font-semibold text-white">{currentUser}</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>

        {(error || articlesError) && (
          <div className="mb-6 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            {error || 'Unable to fetch articles. Please refresh the page.'}
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-700 bg-[#0B1224]/90 p-6 shadow-xl shadow-slate-950/30">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Create or edit article</h2>
                  <p className="mt-1 text-sm text-slate-400">Draft rich posts with a modern editor and save them directly to Supabase.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#0B1224] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                >
                  <Plus className="h-4 w-4" /> New article
                </button>
              </div>

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

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-700 bg-[#0B1224]/90 p-6 shadow-xl shadow-slate-950/30">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Articles panel</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Saved articles</h2>
              </div>
              <button
                onClick={() => refetchArticles()}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2563EB]"
              >
                <RefreshCcw className="h-4 w-4" /> Refresh
              </button>
            </div>

            <ArticleList
              articles={articles}
              loading={loadingArticles}
              onEdit={setSelectedArticle}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
