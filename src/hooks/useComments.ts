import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createComment, deleteComment, getCommentsByArticle } from '../services/comments'
import type { Comment } from '../types/comment'
import { useAuthUser } from './useAuthUser'

export const commentKeys = {
  byArticle: (articleId: string) => ['comments', articleId] as const,
}

export function useComments(articleId?: string) {
  const queryClient = useQueryClient()
  const { user } = useAuthUser()

  const query = useQuery({
    queryKey: commentKeys.byArticle(articleId ?? ''),
    queryFn: () => getCommentsByArticle(articleId!),
    enabled: Boolean(articleId),
    staleTime: 60 * 1000,
  })

  const addMutation = useMutation({
    mutationFn: (input: { content: string; parentId?: string | null }) => {
      if (!user || !articleId) throw new Error('Sign in to comment.')
      return createComment({
        articleId,
        userId: user.id,
        content: input.content,
        parentId: input.parentId,
      })
    },
    onMutate: async (input) => {
      if (!user || !articleId) return
      await queryClient.cancelQueries({ queryKey: commentKeys.byArticle(articleId) })
      const previous = queryClient.getQueryData<Comment[]>(commentKeys.byArticle(articleId)) ?? []
      const optimistic: Comment = {
        id: `optimistic-${Date.now()}`,
        article_id: articleId,
        user_id: user.id,
        parent_id: input.parentId ?? null,
        content: input.content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author_email: user.email ?? null,
        author_name: user.email?.split('@')[0] ?? 'You',
        replies: [],
      }
      const next = input.parentId
        ? appendReply(previous, input.parentId, optimistic)
        : [...previous, optimistic]
      queryClient.setQueryData(commentKeys.byArticle(articleId), next)
      return { previous }
    },
    onError: (_err, _input, context) => {
      if (articleId && context?.previous) {
        queryClient.setQueryData(commentKeys.byArticle(articleId), context.previous)
      }
    },
    onSettled: () => {
      if (articleId) {
        queryClient.invalidateQueries({ queryKey: commentKeys.byArticle(articleId) })
      }
    },
  })

  const removeMutation = useMutation({
    mutationFn: deleteComment,
    onSettled: () => {
      if (articleId) {
        queryClient.invalidateQueries({ queryKey: commentKeys.byArticle(articleId) })
      }
    },
  })

  return {
    comments: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    user,
    addComment: addMutation.mutate,
    isSubmitting: addMutation.isPending,
    removeComment: removeMutation.mutate,
    isDeleting: removeMutation.isPending,
  }
}

function appendReply(tree: Comment[], parentId: string, reply: Comment): Comment[] {
  return tree.map((node) => {
    if (node.id === parentId) {
      return { ...node, replies: [...(node.replies ?? []), reply] }
    }
    if (node.replies?.length) {
      return { ...node, replies: appendReply(node.replies, parentId, reply) }
    }
    return node
  })
}
