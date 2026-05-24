import { useQuery } from '@tanstack/react-query'
import { getArticleBySlug, getArticles } from '../services/articles'
import type { Article } from '../types/article'
import { getArticleViews, getCategorySummaries } from '../utils/articleUtils'

export const articleKeys = {
  all: ['articles'] as const,
  detail: (slug?: string) => ['articles', 'detail', slug] as const,
}

async function fetchArticles() {
  const data = await getArticles()
  if (data === null) {
    throw new Error('Unable to load articles right now.')
  }
  return data
}

export function useArticles() {
  return useQuery<Article[]>({
    queryKey: articleKeys.all,
    queryFn: fetchArticles,
  })
}

export function useArticle(slug?: string) {
  return useQuery<Article | null>({
    queryKey: articleKeys.detail(slug),
    queryFn: async () => {
      if (!slug) return null
      return getArticleBySlug(slug)
    },
    enabled: Boolean(slug),
    staleTime: 10 * 60 * 1000,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: articleKeys.all,
    queryFn: fetchArticles,
    select: getCategorySummaries,
  })
}

export function useTrendingArticles() {
  return useQuery({
    queryKey: articleKeys.all,
    queryFn: fetchArticles,
    select: (articles) => articles.filter((article) => article.trending),
  })
}

export function useSortedArticlesByViews() {
  return useQuery({
    queryKey: articleKeys.all,
    queryFn: fetchArticles,
    select: (articles) => [...articles].sort((a, b) => getArticleViews(b) - getArticleViews(a)),
  })
}

export function useTutorialArticles() {
  return useQuery({
    queryKey: articleKeys.all,
    queryFn: fetchArticles,
    select: (articles) => articles.filter((article) => article.type === 'tutorial'),
  })
}

export function useVideoArticles() {
  return useQuery({
    queryKey: articleKeys.all,
    queryFn: fetchArticles,
    select: (articles) => articles.filter((article) => article.type === 'video'),
  })
}
