import fs from 'fs/promises'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const SITE_URL = 'https://gridaan.com'
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'sitemap.xml')

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null

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

const buildSitemap = ({ homepageLastMod, categoryUrls, articleUrls }) => {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    buildUrlElement({
      loc: `${SITE_URL}/`,
      lastmod: homepageLastMod,
      changefreq: 'daily',
      priority: '1.0',
    }),
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
        priority: '0.70',
      })
    ),
    '</urlset>',
  ]

  return lines.join('\n')
}

const run = async () => {
  let articles = []

  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('slug, category, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn(`WARNING: Failed to fetch articles from Supabase: ${error.message}`)
    } else {
      articles = data ?? []
    }
  } else {
    console.warn(
      'WARNING: Supabase environment variables are not configured. Generating sitemap with homepage only.'
    )
  }
  const articleUrls = articles
    .filter((article) => article.slug)
    .map((article) => ({
      loc: `${SITE_URL}/article/${article.slug}`,
      lastmod: formatDate(article.created_at || new Date().toISOString()),
    }))

  const categoriesBySlug = new Map()

  for (const article of articles) {
    if (!article.category) continue
    const normalized = slugifyCategory(article.category)
    const existing = categoriesBySlug.get(normalized)
    const lastmod = formatDate(article.created_at || new Date().toISOString())
    if (!existing || lastmod > existing.lastmod) {
      categoriesBySlug.set(normalized, {
        category: article.category,
        slug: normalized,
        lastmod,
      })
    }
  }

  const categoryUrls = Array.from(categoriesBySlug.values()).map((item) => ({
    loc: `${SITE_URL}/category/${item.slug}`,
    lastmod: item.lastmod,
  }))

  const homepageLastMod = articles.length
    ? formatDate(articles[0].created_at || new Date().toISOString())
    : formatDate(new Date().toISOString())

  const sitemap = buildSitemap({ homepageLastMod, categoryUrls, articleUrls })
  await fs.writeFile(OUTPUT_PATH, sitemap, 'utf8')
  console.log(`Sitemap generated at ${OUTPUT_PATH}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
