import { useEffect, useMemo, useState, lazy, Suspense, type FormEvent } from 'react'
import 'react-quill/dist/quill.snow.css'
import ImageUpload from './ImageUpload'
import type { ArticlePayload } from '../../services/articles'
import type { Article } from '../../types/article'
import { sanitizeHtml } from '../../utils/sanitize'

const ReactQuill = lazy(() => import('react-quill'))

interface ArticleFormProps {
  article?: Article
  author: string
  categories: string[]
  saving: boolean
  onSave: (article: ArticlePayload) => Promise<void>
  onCancel: () => void
}

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export default function ArticleForm({
  article,
  author,
  categories,
  saving,
  onSave,
  onCancel,
}: ArticleFormProps) {
  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [category, setCategory] = useState(article?.category ?? categories[0] ?? 'General')
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '')
  const [content, setContent] = useState(article?.content ?? '')
  const [imageUrl, setImageUrl] = useState(article?.image_url ?? '')
  const [error, setError] = useState('')

  useEffect(() => {
    setTitle(article?.title ?? '')
    setSlug(article?.slug ?? '')
    setCategory(article?.category ?? categories[0] ?? 'General')
    setExcerpt(article?.excerpt ?? '')
    setContent(article?.content ?? '')
    setImageUrl(article?.image_url ?? '')
    setError('')
  }, [article, categories])

  const isEditing = Boolean(article?.id)

  const canSave = useMemo(
    () => title.trim().length > 3 && slug.trim().length > 3 && content.trim().length > 20 && Boolean(imageUrl.trim()),
    [title, slug, content, imageUrl]
  )

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!isEditing) {
      setSlug(generateSlug(value))
    }
  }

  const handleUploadSuccess = (url: string) => {
    setImageUrl(url)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    if (!canSave) {
      setError('Please complete the title, slug, content, and thumbnail before saving.')
      return
    }

    try {
      // Sanitize content on save as a first layer of defense.
      // NOTE: Client-side sanitization helps, but server-side sanitization
      // and database constraints (RLS, stored procedures) are still required
      // for production-grade security. We also sanitize on render as a
      // second layer (defense-in-depth).
      const sanitizedContent = sanitizeHtml(content || '')

      await onSave({
        id: article?.id,
        title: title.trim(),
        slug: slug.trim(),
        category,
        excerpt: excerpt.trim(),
        content: sanitizedContent,
        image_url: imageUrl,
        author,
      })
    } catch (saveError) {
      setError('Unable to save the article. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-700 bg-[#060A16]/90 p-6 shadow-xl shadow-slate-950/40">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">{isEditing ? 'Edit Article' : 'Create Article'}</h2>
          <p className="mt-1 text-sm text-slate-400">Save rich content directly to Supabase and manage your CMS from one panel.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-700 bg-[#0B1224] px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={!canSave || saving}
            className="rounded-2xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving…' : isEditing ? 'Update Article' : 'Publish Article'}
          </button>
        </div>
      </div>

      {error && <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm font-medium text-slate-200">
          Title
          <input
            value={title}
            onChange={(event) => handleTitleChange(event.target.value)}
            placeholder="Write a strong title"
            className="mt-2 w-full rounded-3xl border border-slate-700 bg-[#0B1224] px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </label>

        <label className="block text-sm font-medium text-slate-200">
          Slug
          <input
            value={slug}
            onChange={(event) => setSlug(generateSlug(event.target.value))}
            placeholder="auto-generated slug"
            className="mt-2 w-full rounded-3xl border border-slate-700 bg-[#0B1224] px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm font-medium text-slate-200">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-700 bg-[#0B1224] px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {categories.map((option) => (
              <option key={option} value={option} className="bg-[#060A16] text-slate-900">{option}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-200">
          Excerpt
          <textarea
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            rows={4}
            placeholder="Write a summary for listing previews"
            className="mt-2 w-full rounded-3xl border border-slate-700 bg-[#0B1224] px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-200">Content</label>
        <div className="rounded-3xl border border-slate-700 bg-[#0B1224] p-2">
          <Suspense fallback={<div className="h-[360px] rounded-3xl bg-[#0B1224]/80 animate-pulse" />}>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="rounded-3xl bg-[#0B1224] text-slate-900"
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ header: [1, 2, 3, 4, false] }],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['blockquote', 'code-block'],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
            />
          </Suspense>
        </div>
      </div>

      <ImageUpload imageUrl={imageUrl} onUpload={handleUploadSuccess} />
    </form>
  )
}
