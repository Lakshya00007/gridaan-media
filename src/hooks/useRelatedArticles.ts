import { useMemo } from 'react'
import { useArticles } from './useArticles'
import type { Article } from '../types/article'

export function useRelatedArticles(
  current?: Article | null,
  limit = 4
): { articles: Article[]; loading: boolean } {
  const { data: all = [], isLoading } = useArticles()

  const articles = useMemo(() => {
    if (!current) return []

    const sameCategory = all.filter(
      (a) =>
        a.id !== current.id &&
        a.category &&
        current.category &&
        a.category.toLowerCase() === current.category.toLowerCase()
    )

    const pool =
      sameCategory.length >= limit
        ? sameCategory
        : [
            ...sameCategory,
            ...all.filter(
              (a) =>
                a.id !== current.id &&
                !sameCategory.some((s) => s.id === a.id)
            ),
          ]

    const trending = pool.filter((a) => a.trending)
    const sorted = [...(trending.length ? trending : pool)].sort(
      (a, b) =>
        new Date(b.created_at ?? 0).getTime() -
        new Date(a.created_at ?? 0).getTime()
    )

    return sorted.slice(0, limit)
  }, [all, current, limit])

  return { articles, loading: isLoading }
}
