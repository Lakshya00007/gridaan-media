import type { Article } from '../types/article'

export interface CategorySummary {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  count: number
  color: string
}

const categoryMeta: Record<string, Pick<CategorySummary, 'description' | 'icon' | 'color'>> = {
  technology: {
    description: 'Latest in tech innovation',
    icon: '💻',
    color: '#2563EB',
  },
  'ai-machine-learning': {
    description: 'Artificial intelligence breakthroughs',
    icon: '🤖',
    color: '#14B8A6',
  },
  ai: {
    description: 'Artificial intelligence breakthroughs',
    icon: '🤖',
    color: '#14B8A6',
  },
  programming: {
    description: 'Coding tutorials and guides',
    icon: '⌨️',
    color: '#64748B',
  },
  'web-development': {
    description: 'Frontend and backend development',
    icon: '🌐',
    color: '#2563EB',
  },
  cybersecurity: {
    description: 'Security news and best practices',
    icon: '🔒',
    color: '#0F172A',
  },
  'cloud-computing': {
    description: 'Cloud platforms, systems, and operations',
    icon: '☁️',
    color: '#64748B',
  },
  devops: {
    description: 'CI/CD, containers, and infrastructure',
    icon: '⚙️',
    color: '#14B8A6',
  },
  tutorial: {
    description: 'Step-by-step learning resources',
    icon: '📚',
    color: '#2563EB',
  },
  tutorials: {
    description: 'Step-by-step learning resources',
    icon: '📚',
    color: '#2563EB',
  },
}

export const slugifyCategory = (value?: string) =>
  (value || 'General')
    .toLowerCase()
    .trim()
    .replace(/\s*&\s*/g, '-')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const normalizeCategoryName = (value?: string) => (value || 'General').trim() || 'General'

export const getCategoryMeta = (name?: string) => {
  const normalized = slugifyCategory(name)
  return categoryMeta[normalized] ?? {
    description: `Stories and insights about ${normalizeCategoryName(name)}`,
    icon: '•',
    color: '#64748B',
  }
}

export const getCategorySummaries = (articles: Article[]): CategorySummary[] => {
  const categories = new Map<string, CategorySummary>()

  for (const article of articles) {
    const name = normalizeCategoryName(article.category)
    const slug = slugifyCategory(name)
    const meta = getCategoryMeta(name)
    const existing = categories.get(slug)

    if (existing) {
      existing.count += 1
    } else {
      categories.set(slug, {
        id: slug,
        name,
        slug,
        count: 1,
        ...meta,
      })
    }
  }

  return Array.from(categories.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export const estimateReadingTime = (content?: string) => {
  if (!content) return 1
  const words = content
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

export const getArticleReadingTime = (article: Article) =>
  article.readingTime ?? estimateReadingTime(article.content)

export const getArticleViews = (article: Article) => article.views ?? 0

export const getArticleDate = (article: Article) => article.created_at ?? ''
