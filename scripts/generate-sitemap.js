import fs from 'fs/promises'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const DEFAULT_SITE_URL = 'https://gridaan.com'
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'sitemap.xml')
const SUPABASE_TIMEOUT_MS = 8000

const STATIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/categories', changefreq: 'weekly', priority: '0.85' },
  { path: '/trending', changefreq: 'daily', priority: '0.90' },
  { path: '/tutorials', changefreq: 'weekly', priority: '0.88' },
  { path: '/videos', changefreq: 'weekly', priority: '0.88' },
  { path: '/search', changefreq: 'weekly', priority: '0.60' },
  { path: '/bookmarks', changefreq: 'weekly', priority: '0.55' },
  { path: '/about', changefreq: 'monthly', priority: '0.50' },
  { path: '/contact', changefreq: 'monthly', priority: '0.50' },
]

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const missingSupabaseEnv = [
  ['VITE_SUPABASE_URL or SUPABASE_URL', supabaseUrl],
  ['VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY', supabaseAnonKey],
].filter(([, value]) => !value).map(([name]) => name)
const hasSupabaseConfig = missingSupabaseEnv.length === 0

const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null

const resolveSiteUrl = () => {
  const candidate =
    process.env.SITE_URL ||
    process.env.VITE_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    DEFAULT_SITE_URL

  try {
    const url = new URL(candidate)
    return url.origin
  } catch {
    console.warn(`WARNING: Invalid SITE_URL "${candidate}". Falling back to ${DEFAULT_SITE_URL}.`)
    return DEFAULT_SITE_URL
  }
}

const SITE_URL = resolveSiteUrl()

const slugifyCategory = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const formatDate = (dateString) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return new Date().toISOString().split('T')[0]
  return date.toISOString().split('T')[0]
}

const buildUrlElement = ({ loc, lastmod, changefreq, priority }) => {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}

const buildSitemap = ({ staticUrls, categoryUrls, articleUrls }) => {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls.map((item) =>
      buildUrlElement({
        loc: item.loc,
        lastmod: item.lastmod,
        changefreq: item.changefreq,
        priority: item.priority,
      })
    ),
    ...categoryUrls.map((item) =>
      buildUrlElement({
        loc: item.loc,
        lastmod: item.lastmod,
        changefreq: 'weekly',
        priority: '0.80',
      })
    ),
    ...articleUrls.map((item) =>
      buildUrlElement({
        loc: item.loc,
        lastmod: item.lastmod,
        changefreq: 'weekly',
        priority: item.priority ?? '0.70',
      })
    ),
    '</urlset>',
  ]

  return lines.join('\n')
}

const withTimeout = async (promise, timeoutMs) => {
  let timeoutId
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`Supabase sitemap query timed out after ${timeoutMs}ms`)), timeoutMs)
  })

  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timeoutId)
  }
}

const fetchArticles = async () => {
  if (!hasSupabaseConfig || !supabase) {
    console.warn(
      `WARNING: Supabase environment variables are not configured (${missingSupabaseEnv.join(', ')}). Generating sitemap with static routes only.`
    )
    return []
  }

  try {
    const { data, error } = await withTimeout(
      supabase
        .from('articles')
        .select('slug, category, created_at, trending, type')
        .eq('status', 'published')
        .order('created_at', { ascending: false }),
      SUPABASE_TIMEOUT_MS
    )

    if (error) {
      console.warn(`WARNING: Failed to fetch articles from Supabase: ${error.message}`)
      return []
    }

    return data ?? []
  } catch (error) {
    console.warn(`WARNING: ${error instanceof Error ? error.message : 'Unexpected Supabase sitemap error'}`)
    return []
  }
}

const run = async () => {
  const articles = await fetchArticles()
  const fallbackLastMod = formatDate(new Date().toISOString())
  const latestArticleMod = articles.length
    ? formatDate(articles[0].created_at || new Date().toISOString())
    : fallbackLastMod

  const staticUrls = STATIC_ROUTES.map((route) => ({
    loc: `${SITE_URL}${route.path}`,
    lastmod: route.path === '/' ? latestArticleMod : fallbackLastMod,
    changefreq: route.changefreq,
    priority: route.priority,
  }))

  const articleUrls = articles
    .filter((article) => article.slug)
    .map((article) => ({
      loc: `${SITE_URL}/article/${article.slug}`,
      lastmod: formatDate(article.created_at || new Date().toISOString()),
      priority: article.trending ? '0.85' : '0.70',
    }))

  const categoriesBySlug = new Map()

  for (const article of articles) {
    if (!article.category) continue
    const normalized = slugifyCategory(article.category)
    const lastmod = formatDate(article.created_at || new Date().toISOString())
    const existing = categoriesBySlug.get(normalized)
    if (!existing || lastmod > existing.lastmod) {
      categoriesBySlug.set(normalized, { slug: normalized, lastmod })
    }
  }

  const categoryUrls = Array.from(categoriesBySlug.values()).map((item) => ({
    loc: `${SITE_URL}/category/${item.slug}`,
    lastmod: item.lastmod,
  }))

  const sitemap = buildSitemap({ staticUrls, categoryUrls, articleUrls })
  await fs.writeFile(OUTPUT_PATH, sitemap, 'utf8')
  console.log(`Sitemap generated at ${OUTPUT_PATH} (${staticUrls.length} static + ${categoryUrls.length} categories + ${articleUrls.length} articles)`)
}

run().catch((error) => {
  console.warn(`WARNING: Sitemap generation fell back after an unexpected error: ${error instanceof Error ? error.message : error}`)
})
