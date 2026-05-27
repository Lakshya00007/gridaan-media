import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
 
import { MessageCircle, Trash2 } from 'lucide-react'
import type { Comment } from '../../types/comment'

interface CommentItemProps {
  comment: Comment
  depth?: number
  currentUserId?: string
  onReply: (parentId: string) => void
  onDelete: (id: string) => void
}

export default function CommentItem({
  comment,
  depth = 0,
  currentUserId,
  onReply,
  onDelete,
}: CommentItemProps) {
  const [showReply, setShowReply] = useState(false)
  const initial = (comment.author_name ?? 'U').charAt(0).toUpperCase()
  const isOwn = currentUserId === comment.user_id

  return (
    <div className={depth > 0 ? 'ml-4 sm:ml-8 border-l border-[#1E293B]/50 pl-4' : ''}>
      <div className="rounded-2xl border border-[#1E293B]/50 bg-[#0B1224]/70 p-4">
        <div className="flex gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#2563EB] to-[#14B8A6] text-sm font-bold text-white"
            aria-hidden
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-[#F8FAFC]">
                {comment.author_name}
              </span>
              <time
                dateTime={comment.created_at}
                className="text-xs text-[#64748B]"
              >
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </time>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#94A3B8] whitespace-pre-wrap">
              {comment.content}
            </p>
            <div className="mt-3 flex items-center gap-3">
              {depth < 2 && (
                <button
                  type="button"
                  onClick={() => {
                    onReply(comment.id)
                    setShowReply(true)
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#14B8A6] hover:text-[#5eead4]"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Reply
                </button>
              )}
              {isOwn && !comment.id.startsWith('optimistic-') && (
                <button
                  type="button"
                  onClick={() => onDelete(comment.id)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-rose-400 hover:text-rose-300"
                  aria-label="Delete comment"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {comment.replies?.map((reply) => (
        <div key={reply.id} className="mt-3">
          <CommentItem
            comment={reply}
            depth={depth + 1}
            currentUserId={currentUserId}
            onReply={onReply}
            onDelete={onDelete}
          />
        </div>
      ))}

      {showReply && (
        <p className="mt-2 text-xs text-[#64748B]">Reply using the form below.</p>
      )}
    </div>
  )
}
