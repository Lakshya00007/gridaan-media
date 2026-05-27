import { useEffect, useMemo, lazy, Suspense, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ChevronRight, Bookmark, Share2, Clock3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { sanitizeHtml } from '../utils/sanitize';
import ReadingProgress from '../components/ui/ReadingProgress';
import Skeleton from '../components/ui/Skeleton';
import Shimmer from '../components/ui/Shimmer';
import AdBanner from '../components/ads/AdBanner';
import SEO from '../components/seo/SEO';

const RelatedArticles = lazy(() => import('../components/articles/RelatedArticles'));
const CommentsSection = lazy(() => import('../components/comments/CommentsSection'));
import { useArticle } from '../hooks/useArticles';
import { slugifyCategory } from '../utils/articleUtils';
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  buildWebsiteSchema,
} from '../utils/seoSchema';
import { siteUrl } from '../lib/theme';
import { getArticleReadingTime } from '../utils/articleUtils';
import { useBookmarks } from '../hooks/useBookmarks';

export default function ArticlePage() {
  const { slug } = useParams();
  const { data: article, isLoading: loading } = useArticle(slug);
  const { bookmarkIds, toggleBookmark, isSaving } = useBookmarks();
  const [shareLabel, setShareLabel] = useState('Share');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const schemas = useMemo(() => {
    if (!article || !slug) return [];
    return [
      buildArticleSchema(article, slug),
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: article.category || 'Articles', path: `/category/${slugifyCategory(article.category)}` },
        { name: article.title, path: `/article/${slug}` },
      ]),
      buildOrganizationSchema(),
      buildWebsiteSchema(),
    ];
  }, [article, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <Skeleton className="h-10 w-2/3 animate-pulse" />
          <Skeleton className="h-6 w-1/2 animate-pulse" />
          <Skeleton className="h-8 w-40 animate-pulse" />
          <Skeleton className="h-48 sm:h-72 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full animate-pulse" />
            <Skeleton className="h-6 w-full animate-pulse" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center bg-bg text-text">
        <h1 className="text-xl font-bold text-text mb-4">Article Not Found</h1>
        <p className="text-xs text-text-secondary mb-6">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-xs font-bold hover:bg-[#1d4ed8] shadow-xs">
          Back to Home
        </Link>
      </div>
    )
  }

  const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
  const cleanContent = sanitizeHtml(article.content || '')
  const canonicalUrl = `${siteUrl}/article/${slug ?? ''}`
  const isBookmarked = bookmarkIds.has(article.id)
  const readTime = getArticleReadingTime(article)

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.title,
          url: canonicalUrl,
        })
        return
      }
      await navigator.clipboard.writeText(canonicalUrl)
      setShareLabel('Copied')
      setTimeout(() => setShareLabel('Share'), 1500)
    } catch {
      setShareLabel('Share')
    }
  }

  return (
    <>
      <SEO
        title={article.title}
        description={article.excerpt ?? undefined}
        image={article.image_url ?? undefined}
        url={canonicalUrl}
        type="article"
        schema={schemas[0]}
      />
      {schemas.slice(1).map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
      <ReadingProgress />
      <article className="min-h-screen bg-[#f8f8f7] transition-colors duration-300">
        <div className="mx-auto max-w-[760px] px-4 pt-6 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#7a7a7a]">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden />
            <Link to={`/category/${slugifyCategory(article.category)}`} className="hover:text-primary">{article.category || 'General'}</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden />
            <span className="truncate text-[#8a8a8a] max-w-[min(100%,12rem)] sm:max-w-xs">{article.title}</span>
          </nav>
        </div>

        <header className="mx-auto max-w-[760px] px-4 pb-8 pt-10 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#e6e6e6] bg-white px-3 py-1 text-xs font-medium text-[#4a4a4a]">{article.category || 'General'}</span>
            <span className="flex items-center gap-1.5 text-xs text-[#7a7a7a]"><Calendar className="w-3.5 h-3.5" aria-hidden /> {formatDate(article.created_at)}</span>
            <span className="flex items-center gap-1.5 text-xs text-[#7a7a7a]"><Clock3 className="w-3.5 h-3.5" aria-hidden /> {readTime} min read</span>
          </div>

          <h1 className="mb-6 text-[clamp(2rem,3.2vw,3.2rem)] font-semibold leading-tight text-[#1c1c1c] font-serif">{article.title}</h1>
          {article.excerpt && <p className="mb-8 text-lg leading-relaxed text-[#5d5d5d]">{article.excerpt}</p>}

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e6e6e6] bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4ff] text-sm font-semibold text-[#1d4ed8]">
                {(article.author || 'G').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-[#242424]">{article.author || 'Gridaan Editorial'}</p>
                <p className="text-xs text-[#7a7a7a]">Published {formatDate(article.created_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleBookmark(article.id, { title: article.title, slug: article.slug })}
                disabled={isSaving}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  isBookmarked
                    ? 'border-[#cfe0ff] bg-[#eef4ff] text-[#1d4ed8]'
                    : 'border-[#e6e6e6] bg-white text-[#4b4b4b] hover:bg-[#f5f5f2]'
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" />
                {isBookmarked ? 'Saved' : 'Save'}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1 rounded-full border border-[#e6e6e6] bg-white px-3 py-1.5 text-xs font-medium text-[#4b4b4b] transition hover:bg-[#f5f5f2]"
              >
                <Share2 className="h-3.5 w-3.5" />
                {shareLabel}
              </button>
            </div>
          </div>

          {article.image_url && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white shadow-sm">
              <img src={article.image_url} alt={article.title} loading="eager" fetchPriority="high" className="w-full h-auto object-cover max-h-[500px]" width={1200} height={630} />
            </div>
          )}
          </motion.div>
        </header>

        <div className="mx-auto max-w-[760px] px-4 pb-12 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
          >
          <div 
            className="prose prose-base md:prose-lg max-w-none text-[#353535] leading-relaxed prose-custom prose-headings:text-[#1c1c1c] prose-headings:font-semibold prose-a:text-[#1d4ed8] prose-strong:text-[#1c1c1c]" 
            dangerouslySetInnerHTML={{ __html: cleanContent }} 
          />
          </motion.div>

          <div className="my-10">
            <AdBanner position="in-article" />
          </div>

          <Suspense fallback={<div className="mt-16 space-y-4"><Shimmer className="h-8 w-48" />{[1,2,3].map(i => <Shimmer key={i} className="h-28" />)}</div>}>
            <RelatedArticles article={article} />
          </Suspense>
          <Suspense fallback={<div className="mt-16"><Shimmer className="h-8 w-40 mb-4" /><Shimmer className="h-32" /></div>}>
            <CommentsSection articleId={article.id} articleTitle={article.title} />
          </Suspense>
        </div>
      </article>
    </>
  )
}
