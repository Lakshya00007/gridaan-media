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
const DEFAULT_IMAGE = `${DEFAULT_SITE_URL}/images/hero-bg.jpg`

function buildAbsoluteUrl(value?: string) {
  if (!value) return undefined
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  if (value.startsWith('/')) return `${DEFAULT_SITE_URL}${value}`
  return `${DEFAULT_SITE_URL}/${value}`
}

function generateSvgOgImage(title: string, category: string) {
  const cleanTitle = title.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });

  const cleanCategory = category.toUpperCase().replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });

  // Split title into lines of approx 24 chars to avoid SVG overflow
  const words = cleanTitle.split(' ');
  let line1 = '';
  let line2 = '';
  let line3 = '';

  for (const word of words) {
    if ((line1 + ' ' + word).length < 24) {
      line1 += (line1 ? ' ' : '') + word;
    } else if ((line2 + ' ' + word).length < 24) {
      line2 += (line2 ? ' ' : '') + word;
    } else if ((line3 + ' ' + word).length < 24) {
      line3 += (line3 ? ' ' : '') + word;
    }
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="#f8fafc"/>
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2563eb" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.03"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgGrad)"/>
      <g transform="translate(100, 140)">
        <text fill="#2563eb" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" letter-spacing="3">${cleanCategory}</text>
        <text fill="#0f172a" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="800" y="90">${line1}</text>
        ${line2 ? `<text fill="#0f172a" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="800" y="165">${line2}</text>` : ''}
        ${line3 ? `<text fill="#0f172a" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="800" y="240">${line3}</text>` : ''}
        <text fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" y="380">GRIDAAN MEDIA PUBLICATION</text>
      </g>
    </svg>
  `;
  // Use browser `btoa` when available, otherwise fall back to Node Buffer
  const base64 = (typeof window !== 'undefined' && typeof window.btoa === 'function')
    ? btoa(unescape(encodeURIComponent(svg)))
    : Buffer.from(svg).toString('base64');

  return `data:image/svg+xml;base64,${base64}`;
}

export default function SEO({ title, description, image, url, type = 'website', noIndex, schema }: SEOProps) {
  const resolvedTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE
  const resolvedDescription = description || DEFAULT_DESCRIPTION
  const currentLocation = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}${window.location.search}${window.location.hash.replace(/^#/, '')}`
    : DEFAULT_SITE_URL
  const resolvedUrl = buildAbsoluteUrl(url) || currentLocation
  
  // Auto-generate preview image if missing
  const resolvedImage = image 
    ? (buildAbsoluteUrl(image) || DEFAULT_IMAGE)
    : generateSvgOgImage(title || DEFAULT_TITLE, type === 'article' ? 'Article' : 'Technology');

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
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={resolvedImage} />
      <meta name="twitter:site" content="@GridaanCMS" />
      <meta name="twitter:creator" content="@GridaanCMS" />
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  )
}
