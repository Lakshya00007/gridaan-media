import { siteUrl } from '../lib/theme'
import type { Article } from '../types/article'

export function buildArticleSchema(article: Article, slug: string) {
  const url = `${siteUrl}/article/${slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: article.title,
    description: article.excerpt || '',
    image: article.image_url ? [article.image_url] : undefined,
    author: { '@type': 'Person', name: article.author || 'Gridaan Editorial' },
    publisher: {
      '@type': 'Organization',
      name: 'Gridaan',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/images/gridaan-logo.svg` },
    },
    datePublished: article.created_at || new Date().toISOString(),
    dateModified: article.created_at || new Date().toISOString(),
  }
}

export function buildBreadcrumbSchema(
  items: { name: string; path: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path.startsWith('/') ? item.path : `/${item.path}`}`,
    })),
  }
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gridaan',
    url: siteUrl,
    logo: `${siteUrl}/images/gridaan-logo.svg`,
    sameAs: ['https://twitter.com/GridaanCMS'],
  }
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gridaan',
    url: siteUrl,
    description:
      'Premium AI and technology publication covering innovation, tutorials, and industry insight.',
    publisher: { '@type': 'Organization', name: 'Gridaan' },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
