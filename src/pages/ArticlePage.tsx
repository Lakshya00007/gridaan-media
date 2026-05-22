import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { sanitizeHtml } from '../utils/sanitize';
import ReadingProgress from '../components/ui/ReadingProgress';
import Skeleton from '../components/ui/Skeleton';
import AdBanner from '../components/ads/AdBanner';
import SEO from '../components/seo/SEO';
import { getArticleBySlug, ArticleRecord } from '../services/articles';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<ArticleRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      if (!slug) {
        setArticle(null)
        setLoading(false)
        return
      }
      try {
        const data = await getArticleBySlug(slug as string)
        setArticle(data)
      } catch (err) {
        console.error(err)
        setArticle(null)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1224] dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-72 rounded-[2rem]" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-4/6" />
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-[#F8FAFC] dark:text-white mb-4">Article Not Found</h1>
        <p className="text-[#94A3B8] dark:text-[#94A3B8] mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#327CFA] text-white rounded-xl font-medium hover:bg-[#003CC6] transition-colors">
          Back to Home
        </Link>
      </div>
    )
  }

  const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

  const cleanContent = sanitizeHtml(article.content || '')
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : `https://gridaan.io/article/${slug ?? ''}`

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: article.title,
    description: article.excerpt || '',
    image: article.image_url ? [article.image_url] : undefined,
    author: {
      '@type': 'Person',
      name: article.author || 'Admin',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gridaan',
    },
    datePublished: article.created_at || new Date().toISOString(),
  }

  return (
    <>
      <SEO
        title={article.title}
        description={article.excerpt ?? undefined}
        image={article.image_url ?? undefined}
        url={canonicalUrl}
      />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <ReadingProgress />
      <article className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <nav className="flex items-center gap-2 text-sm text-[#94A3B8] dark:text-[#94A3B8]">
            <Link to="/" className="hover:text-[#327CFA] dark:hover:text-[#94A3B8]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/category/${(article.category || 'general').toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="hover:text-[#327CFA] dark:hover:text-[#94A3B8]">{article.category || 'General'}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#94A3B8] dark:text-[#94A3B8] truncate max-w-[200px]">{article.title}</span>
          </nav>
        </div>

        <header className="max-w-4xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3 py-1 bg-[#0B1224] dark:bg-[#0B1224]/30 text-[#327CFA] dark:text-[#94A3B8] rounded-full text-xs font-medium">{article.category || 'General'}</span>
            <span className="flex items-center gap-1 text-xs text-[#94A3B8]"><Calendar className="w-3 h-3" /> {formatDate(article.created_at)}</span>
            <span className="flex items-center gap-1 text-xs text-[#94A3B8]">By <strong className="text-[#F8FAFC] dark:text-white ml-1">{article.author || 'Admin'}</strong></span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F8FAFC] dark:text-white leading-tight mb-6">{article.title}</h1>
          {article.excerpt && <p className="text-lg text-gray-600 dark:text-[#94A3B8] leading-relaxed mb-6">{article.excerpt}</p>}

          {article.image_url && (
            <div className="rounded-2xl overflow-hidden mb-8">
              <img src={article.image_url} alt={article.title} className="w-full h-auto object-cover rounded-2xl" />
            </div>
          )}
        </header>

        <div className="max-w-4xl mx-auto px-4 pb-12">
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-[#F8FAFC]" dangerouslySetInnerHTML={{ __html: cleanContent }} />

          <div className="my-8">
            <AdBanner position="in-article" />
          </div>
        </div>
      </article>
    </>
  )
}
