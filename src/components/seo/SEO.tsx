import { Helmet } from 'react-helmet-async'

export interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

const DEFAULT_TITLE = 'Gridaan'
const DEFAULT_DESCRIPTION = 'Gridaan is a modern publishing platform for technology, AI, tutorials, and business stories.'
const DEFAULT_SITE_URL = 'https://gridaan.io'

export default function SEO({ title, description, image, url }: SEOProps) {
  const resolvedTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE
  const resolvedDescription = description || DEFAULT_DESCRIPTION
  const resolvedUrl = url || (typeof window !== 'undefined' ? window.location.href : DEFAULT_SITE_URL)
  const resolvedImage = image || undefined

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={resolvedUrl} />

      <meta property="og:type" content="article" />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:url" content={resolvedUrl} />
      <meta property="og:site_name" content={DEFAULT_TITLE} />
      {resolvedImage && <meta property="og:image" content={resolvedImage} />}

      <meta name="twitter:card" content={resolvedImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      {resolvedImage && <meta name="twitter:image" content={resolvedImage} />}
      <meta name="twitter:site" content="@GridaanCMS" />
      <meta name="robots" content="index, follow" />
    </Helmet>
  )
}
