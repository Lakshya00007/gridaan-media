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
      <article className="min-h-screen bg-bg transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-text-secondary flex-wrap">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden />
            <Link to={`/category/${slugifyCategory(article.category)}`} className="hover:text-primary">{article.category || 'General'}</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden />
            <span className="text-text-secondary truncate max-w-[min(100%,12rem)] sm:max-w-xs">{article.title}</span>
          </nav>
        </div>

        <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-2.5 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">{article.category || 'General'}</span>
            <span className="flex items-center gap-1 text-[10px] text-text-secondary font-semibold"><Calendar className="w-3.5 h-3.5 text-text-secondary" aria-hidden /> {formatDate(article.created_at)}</span>
            <span className="text-[10px] text-text-secondary font-semibold">By <strong className="text-text ml-0.5">{article.author || 'Gridaan'}</strong></span>
          </div>

          <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-extrabold text-text leading-tight mb-4">{article.title}</h1>
          {article.excerpt && <p className="text-sm text-text-secondary leading-relaxed mb-6 font-medium">{article.excerpt}</p>}

          {article.image_url && (
            <div className="rounded-3xl overflow-hidden mb-8 border border-border shadow-xs">
              <img src={article.image_url} alt={article.title} loading="eager" fetchPriority="high" className="w-full h-auto object-cover max-h-[480px]" width={1200} height={630} />
            </div>
          )}
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
          <div 
            className="prose prose-sm md:prose-base max-w-none text-text-secondary leading-relaxed prose-custom prose-headings:text-text prose-headings:font-bold prose-a:text-primary prose-strong:text-text prose-code:text-primary" 
            dangerouslySetInnerHTML={{ __html: cleanContent }} 
          />

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
