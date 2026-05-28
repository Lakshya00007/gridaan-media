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
  const [status, setStatus] = useState<Article['status']>(article?.status ?? 'published')
  const [error, setError] = useState('')

  useEffect(() => {
    setTitle(article?.title ?? '')
    setSlug(article?.slug ?? '')
    setCategory(article?.category ?? categories[0] ?? 'General')
    setExcerpt(article?.excerpt ?? '')
    setContent(article?.content ?? '')
    setImageUrl(article?.image_url ?? '')
    setStatus(article?.status ?? 'published')
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
        status,
      })
    } catch (saveError) {
      setError('Unable to save the article. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text">{isEditing ? 'Edit Article' : 'Create Article'}</h2>
          <p className="mt-1 text-sm text-text-secondary">Save rich content directly to Supabase and manage your CMS from one panel.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border bg-[#fafaf9] px-4 py-2 text-sm font-medium text-text transition hover:bg-[#f5f5f2] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={!canSave || saving}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {saving ? 'Saving…' : isEditing ? 'Update Article' : 'Publish Article'}
          </button>
        </div>
      </div>

      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm font-medium text-text">
          Title
          <input
            value={title}
            onChange={(event) => handleTitleChange(event.target.value)}
            placeholder="Write a strong title"
            className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label className="block text-sm font-medium text-text">
          Slug
          <input
            value={slug}
            onChange={(event) => setSlug(generateSlug(event.target.value))}
            placeholder="auto-generated slug"
            className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm font-medium text-text">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-text">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as Article['status'])}
            className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </label>

        <label className="block text-sm font-medium text-text lg:col-span-2">
          Excerpt
          <textarea
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            rows={4}
            placeholder="Write a summary for listing previews"
            className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-text">Content</label>
        <div className="rounded-2xl border border-border bg-white p-2">
          <Suspense fallback={<div className="h-[360px] rounded-2xl bg-[#fafaf9] animate-pulse" />}>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="rounded-2xl bg-white text-text"
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
