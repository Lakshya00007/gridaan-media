import { useEffect, useMemo, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
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

export default function ArticlePage() {
  const { slug } = useParams();
  const { data: article, isLoading: loading } = useArticle(slug);

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
      <div className="min-h-screen bg-[#080d1a] py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-48 sm:h-72 rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-[#F8FAFC] mb-4">Article Not Found</h1>
        <p className="text-[#64748B] mb-6">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-[#1D4ED8] transition-colors">
          Back to Home
        </Link>
      </div>
    )
  }

  const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
  const cleanContent = sanitizeHtml(article.content || '')
  const canonicalUrl = `${siteUrl}/article/${slug ?? ''}`

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
      <article className="min-h-screen bg-[#080d1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#64748B] flex-wrap">
            <Link to="/" className="hover:text-[#14B8A6]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden />
            <Link to={`/category/${slugifyCategory(article.category)}`} className="hover:text-[#14B8A6]">{article.category || 'General'}</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden />
            <span className="text-[#94A3B8] truncate max-w-[min(100%,12rem)] sm:max-w-xs">{article.title}</span>
          </nav>
        </div>

        <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3 py-1 bg-[#0B1224] text-[#14B8A6] rounded-full text-xs font-medium ring-1 ring-[#14B8A6]/30">{article.category || 'General'}</span>
            <span className="flex items-center gap-1 text-xs text-[#64748B]"><Calendar className="w-3 h-3" aria-hidden /> {formatDate(article.created_at)}</span>
            <span className="text-xs text-[#64748B]">By <strong className="text-[#F8FAFC] ml-1">{article.author || 'Gridaan'}</strong></span>
          </div>

          <h1 className="text-[clamp(1.75rem,4vw,3rem)] font-bold text-[#F8FAFC] leading-tight mb-6">{article.title}</h1>
          {article.excerpt && <p className="text-lg text-[#94A3B8] leading-relaxed mb-6">{article.excerpt}</p>}

          {article.image_url && (
            <div className="rounded-2xl overflow-hidden mb-8 ring-1 ring-white/10">
              <img src={article.image_url} alt={article.title} loading="eager" fetchPriority="high" className="w-full h-auto object-cover" width={1200} height={630} />
            </div>
          )}
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
          <div className="prose prose-lg prose-invert max-w-none text-[#E2E8F0] prose-custom prose-headings:text-[#F8FAFC] prose-a:text-[#14B8A6]" dangerouslySetInnerHTML={{ __html: cleanContent }} />

          <div className="my-8">
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
