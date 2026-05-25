import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createBookmark, deleteBookmark, getBookmarks, type BookmarkRecord } from '../services/bookmarks'
import { useAuthUser } from './useAuthUser'

export const bookmarkKeys = {
  all: ['bookmarks'] as const,
  list: (userId?: string) => ['bookmarks', userId] as const,
}

export function useBookmarks() {
  const queryClient = useQueryClient()
  const { user, loading: userLoading } = useAuthUser()

  const query = useQuery<BookmarkRecord[]>({
    queryKey: bookmarkKeys.list(user?.id),
    queryFn: () => user ? getBookmarks(user.id) : Promise.resolve([]),
    enabled: Boolean(user),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  })

  const bookmarkIds = useMemo(
    () => new Set((query.data ?? []).map((bookmark) => bookmark.article_id)),
    [query.data]
  )

  const addMutation = useMutation({
    mutationFn: createBookmark,
    onMutate: async (articleId) => {
      if (!user) return
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.list(user.id) })
      const previous = queryClient.getQueryData<BookmarkRecord[]>(bookmarkKeys.list(user.id)) ?? []
      queryClient.setQueryData<BookmarkRecord[]>(bookmarkKeys.list(user.id), [
        {
          id: `optimistic-${articleId}`,
          user_id: user.id,
          article_id: articleId,
          created_at: new Date().toISOString(),
        },
        ...previous,
      ])
      return { previous }
    },
    onError: (error, _articleId, context) => {
      if (user && context?.previous) {
        queryClient.setQueryData(bookmarkKeys.list(user.id), context.previous)
      }
      toast.error(error instanceof Error ? error.message : 'Unable to save bookmark.')
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: bookmarkKeys.list(user.id) })
      }
    },
  })

  const removeMutation = useMutation({
    mutationFn: deleteBookmark,
    onMutate: async (articleId) => {
      if (!user) return
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.list(user.id) })
      const previous = queryClient.getQueryData<BookmarkRecord[]>(bookmarkKeys.list(user.id)) ?? []
      queryClient.setQueryData<BookmarkRecord[]>(
        bookmarkKeys.list(user.id),
        previous.filter((bookmark) => bookmark.article_id !== articleId)
      )
      return { previous }
    },
    onError: (error, _articleId, context) => {
      if (user && context?.previous) {
        queryClient.setQueryData(bookmarkKeys.list(user.id), context.previous)
      }
      toast.error(error instanceof Error ? error.message : 'Unable to remove bookmark.')
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: bookmarkKeys.list(user.id) })
      }
    },
  })

  const toggleBookmark = (articleId: string) => {
    if (!user) {
      toast.error('Please sign in to bookmark articles.')
      return
    }

    if (bookmarkIds.has(articleId)) {
      removeMutation.mutate(articleId)
    } else {
      addMutation.mutate(articleId)
    }
  }

  return {
    bookmarkIds,
    bookmarks: query.data ?? [],
    loading: userLoading || (Boolean(user) && query.isLoading),
    error: query.error,
    user,
    toggleBookmark,
    isSaving: addMutation.isPending || removeMutation.isPending,
  }
}
