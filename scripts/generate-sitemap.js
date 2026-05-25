import fs from 'fs/promises'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

if (!globalThis.WebSocket) {
  globalThis.WebSocket = ws
}

const DEFAULT_SITE_URL = 'https://gridaan.com'
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'sitemap.xml')
const SUPABASE_TIMEOUT_MS = 15000

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

/** Load .env files for local/CI runs (Vercel injects env directly). */
function loadEnvFiles() {
  for (const filename of ['.env.local', '.env.production', '.env']) {
    const filePath = path.join(process.cwd(), filename)
    if (!existsSync(filePath)) continue

    const content = readFileSync(filePath, 'utf8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (process.env[key] === undefined) {
        process.env[key] = value
      }
    }
  }
}

loadEnvFiles()

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''

const missingSupabaseEnv = []
if (!supabaseUrl) {
  missingSupabaseEnv.push('SUPABASE_URL or VITE_SUPABASE_URL')
}
if (!supabaseAnonKey) {
  missingSupabaseEnv.push('SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY')
}

const hasSupabaseConfig = missingSupabaseEnv.length === 0

function maskSecret(value) {
  if (!value || value.length < 8) return '(missing)'
  return `${value.slice(0, 4)}…${value.slice(-4)}`
}

const resolveSiteUrl = () => {
  const candidate =
    process.env.SITE_URL ||
    process.env.VITE_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    DEFAULT_SITE_URL

  try {
    return new URL(candidate).origin
  } catch {
    console.warn(
      `[sitemap] Invalid SITE_URL "${candidate}". Using ${DEFAULT_SITE_URL}.`
    )
    return DEFAULT_SITE_URL
  }
}

const SITE_URL = resolveSiteUrl()

/** Match src/utils/articleUtils.ts slugifyCategory for route parity */
const slugifyCategory = (value) =>
  (value || 'General')
    .toLowerCase()
    .trim()
    .replace(/\s*&\s*/g, '-')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const formatDate = (dateString) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return new Date().toISOString().split('T')[0]
  return date.toISOString().split('T')[0]
}

const buildUrlElement = ({ loc, lastmod, changefreq, priority }) =>
  `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`

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

const withTimeout = async (label, promise, timeoutMs) => {
  let timeoutId
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`${label} timed out after ${timeoutMs}ms`)),
      timeoutMs
    )
  })

  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timeoutId)
  }
}

function logSupabaseError(context, error) {
  console.error(`[sitemap] Supabase error (${context}):`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  })
}

function createSupabaseClient() {
  if (!hasSupabaseConfig) {
    console.error(
      `[sitemap] Missing Supabase environment variables: ${missingSupabaseEnv.join(', ')}`
    )
    return null
  }

  console.log('[sitemap] Supabase config detected:', {
    url: supabaseUrl,
    anonKey: maskSecret(supabaseAnonKey),
    siteUrl: SITE_URL,
  })

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

async function fetchPublishedArticles(supabase) {
  const select = 'slug, category, created_at'
  const order = { ascending: false }

  let response = await withTimeout(
    'articles (published)',
    supabase
      .from('articles')
      .select(`${select}, status`)
      .eq('status', 'published')
      .order('created_at', order),
    SUPABASE_TIMEOUT_MS
  )

  if (
    response.error &&
    response.error.code === '42703' &&
    /status/i.test(response.error.message || '')
  ) {
    console.warn(
      '[sitemap] articles.status column unavailable; including all article rows'
    )
    response = await withTimeout(
      'articles (no status column)',
      supabase.from('articles').select(select).order('created_at', order),
      SUPABASE_TIMEOUT_MS
    )
  } else if (
    response.error &&
    response.error.code === '42703'
  ) {
    console.warn(
      '[sitemap] Retrying article fetch with minimal columns:',
      response.error.message
    )
    response = await withTimeout(
      'articles (minimal)',
      supabase.from('articles').select(select).order('created_at', order),
      SUPABASE_TIMEOUT_MS
    )
  }

  if (response.error) {
    logSupabaseError('fetch articles', response.error)
    throw response.error
  }

  const rows = response.data ?? []
  const published = rows.filter((row) => {
    if (row.status === undefined) return Boolean(row.slug)
    return row.status === 'published'
  })

  console.log(
    `[sitemap] Fetched ${rows.length} article row(s); ${published.length} published for sitemap`
  )

  return published
}

function buildCategoryUrls(articles) {
  const categoriesBySlug = new Map()

  for (const article of articles) {
    if (!article.category) continue
    const slug = slugifyCategory(article.category)
    if (!slug) continue
    const lastmod = formatDate(article.created_at || new Date().toISOString())
    const existing = categoriesBySlug.get(slug)
    if (!existing || lastmod > existing.lastmod) {
      categoriesBySlug.set(slug, { slug, lastmod })
    }
  }

  const categoryUrls = Array.from(categoriesBySlug.values()).map((item) => ({
    loc: `${SITE_URL}/category/${item.slug}`,
    lastmod: item.lastmod,
  }))

  console.log(`[sitemap] Built ${categoryUrls.length} category URL(s) from articles`)

  return categoryUrls
}

const run = async () => {
  console.log('[sitemap] Starting sitemap generation…')

  let articles = []

  if (!hasSupabaseConfig) {
    console.error(
      `[sitemap] Cannot fetch dynamic URLs. Missing: ${missingSupabaseEnv.join(', ')}`
    )
  } else {
    const supabase = createSupabaseClient()
    articles = await fetchPublishedArticles(supabase)
  }

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
      priority: '0.70',
    }))

  const categoryUrls = buildCategoryUrls(articles)

  const sitemap = buildSitemap({ staticUrls, categoryUrls, articleUrls })
  await fs.writeFile(OUTPUT_PATH, sitemap, 'utf8')

  console.log('[sitemap] Wrote', OUTPUT_PATH)
  console.log('[sitemap] Final counts:', {
    staticRoutes: staticUrls.length,
    dynamicCategories: categoryUrls.length,
    dynamicArticles: articleUrls.length,
    totalUrls: staticUrls.length + categoryUrls.length + articleUrls.length,
  })

  if (hasSupabaseConfig && articleUrls.length === 0) {
    console.warn(
      '[sitemap] Supabase is configured but no published article URLs were added. Check RLS policies and article status values.'
    )
  }
}

run().catch((error) => {
  console.error('[sitemap] Generation failed:', error)
  process.exit(1)
})
