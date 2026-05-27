import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send } from 'lucide-react'
import { useComments } from '../../hooks/useComments'
import CommentItem from './CommentItem'
import Shimmer from '../ui/Shimmer'

interface CommentsSectionProps {
  articleId: string
  articleTitle: string
}

export default function CommentsSection({
  articleId,
  articleTitle,
}: CommentsSectionProps) {
  const [content, setContent] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const {
    comments,
    loading,
    error,
    user,
    addComment,
    isSubmitting,
    removeComment,
  } = useComments(articleId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed || !user) return

    addComment(
      { content: trimmed, parentId: replyTo },
      {
        onSuccess: () => {
          setContent('')
          setReplyTo(null)
        },
      }
    )
  }

  return (
    <section className="mt-16" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="mb-6 text-2xl font-semibold text-[#1c1c1c]">
        Discussion
        <span className="ml-2 text-base font-normal text-[#6b6b6b]">
          ({comments.length})
        </span>
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {replyTo && (
            <p className="mb-2 text-xs text-[#14B8A6]">
              Replying to a comment —{' '}
              <button
                type="button"
                className="underline"
                onClick={() => setReplyTo(null)}
              >
                cancel
              </button>
            </p>
          )}
          <label htmlFor="comment-input" className="sr-only">
            Write a comment
          </label>
          <textarea
            id="comment-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Share your thoughts…"
            className="w-full resize-y rounded-2xl border border-[#e6e6e6] bg-white px-4 py-3 text-sm text-[#1c1c1c] placeholder-[#8a8a8a] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          />
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Posting…' : 'Post comment'}
          </button>
        </form>
      ) : (
        <div className="mb-8 rounded-2xl border border-[#e6e6e6] bg-[#fafaf9] p-6 text-center">
          <p className="text-sm text-[#6b6b6b]">
            <Link to="/login" className="font-medium text-[#14B8A6] hover:underline">
              Sign in
            </Link>{' '}
            to join the discussion on &ldquo;{articleTitle}&rdquo;.
          </p>
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Comments are unavailable. Run the Supabase comments migration if this is a new deploy.
        </p>
      )}

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => <Shimmer key={i} className="h-24" />)
        ) : comments.length === 0 ? (
          <p className="text-sm text-[#6b6b6b]">No comments yet. Start the conversation.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={user?.id}
              onReply={setReplyTo}
              onDelete={removeComment}
            />
          ))
        )}
      </div>
    </section>
  )
}
