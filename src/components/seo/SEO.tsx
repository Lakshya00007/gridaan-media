import { Helmet } from 'react-helmet-async'

export interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  schema?: object
}

const DEFAULT_TITLE = 'Gridaan'
const DEFAULT_DESCRIPTION = 'Gridaan is a modern publishing platform for technology, AI, tutorials, and business stories.'
const DEFAULT_SITE_URL = 'https://gridaan.com'
const DEFAULT_IMAGE = `${DEFAULT_SITE_URL}/images/gridaan-logo.svg`

function buildAbsoluteUrl(value?: string) {
  if (!value) return undefined
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  if (value.startsWith('/')) return `${DEFAULT_SITE_URL}${value}`
  return `${DEFAULT_SITE_URL}/${value}`
}

export default function SEO({ title, description, image, url, type = 'website', noIndex, schema }: SEOProps) {
  const resolvedTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE
  const resolvedDescription = description || DEFAULT_DESCRIPTION
  const currentLocation = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}${window.location.search}${window.location.hash.replace(/^#/, '')}`
    : DEFAULT_SITE_URL
  const resolvedUrl = buildAbsoluteUrl(url) || currentLocation
  const resolvedImage = buildAbsoluteUrl(image) || DEFAULT_IMAGE
  const robots = noIndex ? 'noindex, nofollow' : 'index, follow'

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={resolvedUrl} />
      <meta name="robots" content={robots} />
      <meta name="theme-color" content="#2563EB" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:url" content={resolvedUrl} />
      <meta property="og:site_name" content={DEFAULT_TITLE} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={resolvedImage} />
      <meta property="twitter:card" content={resolvedImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={resolvedImage} />
      <meta name="twitter:site" content="@GridaanCMS" />
      <meta name="twitter:creator" content="@GridaanCMS" />
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  )
}
