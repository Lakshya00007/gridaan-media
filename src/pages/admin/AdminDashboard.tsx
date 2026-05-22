import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, RefreshCcw, LogOut } from 'lucide-react'
import { Session } from '@supabase/supabase-js'
import toast, { Toaster } from 'react-hot-toast'
import ArticleForm from '../../components/admin/ArticleForm'
import ArticleList from '../../components/admin/ArticleList'
import { createArticle, deleteArticle, getArticles, ArticlePayload, ArticleRecord, updateArticle } from '../../services/articles'
import { sanitizeHtml } from '../../utils/sanitize'
import { signOut } from '../../lib/auth'
import { supabase } from '../../lib/supabase'

const categories = ['Technology', 'AI', 'Web Development', 'Business', 'Culture', 'Tutorial']

export default function AdminDashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const [articles, setArticles] = useState<ArticleRecord[]>([])
  const [selectedArticle, setSelectedArticle] = useState<ArticleRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const loadArticles = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getArticles()
      setArticles(data ?? [])
    } catch (loadError) {
      const message = 'Unable to fetch articles. Please refresh the page.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/admin')
  }

  const handleSave = async (article: ArticlePayload & { id?: string }) => {
    setSaving(true)
    setError('')

    try {
      // Sanitize content again here for defense-in-depth. Server-side
      // sanitization is still recommended; this ensures any caller that
      // bypasses the form is less likely to store raw dangerous HTML.
      const sanitizedArticle = {
        ...article,
        content: sanitizeHtml(article.content || ''),
      }

      if (article.id) {
        await updateArticle(article.id, sanitizedArticle)
        toast.success('Article updated successfully.')
      } else {
        await createArticle(sanitizedArticle)
        toast.success('Article published successfully.')
      }
      setSelectedArticle(null)
      await loadArticles()
    } catch (saveError) {
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
    setLoading(true)

    try {
      await deleteArticle(id)
      toast.success('Article deleted successfully.')
      await loadArticles()
    } catch {
      const message = 'Unable to delete the article. Please try again.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const securePage = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data?.session) {
        navigate('/admin')
        return
      }
      setSession(data.session)
      await loadArticles()
    }

    securePage()

    const { data: listener } = supabase.auth.onAuthStateChange((_, authSession) => {
      if (!authSession) {
        navigate('/admin')
      } else {
        setSession(authSession)
      }
    })

    return () => {
      listener.subscription?.unsubscribe?.()
    }
  }, [navigate])

  if (!session) {
    return (
      <div className="min-h-screen bg-[#060A16] text-slate-100 flex items-center justify-center">
        <div className="rounded-3xl border border-slate-700 bg-[#0B1224]/90 px-8 py-6 text-center shadow-2xl shadow-slate-950/30">
          <p className="text-lg font-medium">Verifying admin session…</p>
        </div>
      </div>
    )
  }

  const currentUser = session.user.email ?? 'Admin'

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

        {error && (
          <div className="mb-6 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            {error}
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
                onClick={loadArticles}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#327CFA] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#327CFA]"
              >
                <RefreshCcw className="h-4 w-4" /> Refresh
              </button>
            </div>

            <ArticleList
              articles={articles}
              loading={loading}
              onEdit={setSelectedArticle}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
