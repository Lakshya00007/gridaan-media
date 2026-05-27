import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { useRelatedArticles } from '../../hooks/useRelatedArticles'
import type { Article } from '../../types/article'
import { getArticleReadingTime } from '../../utils/articleUtils'
import Shimmer from '../ui/Shimmer'

interface RelatedArticlesProps {
  article: Article
}

export default function RelatedArticles({ article }: RelatedArticlesProps) {
  const { articles, loading } = useRelatedArticles(article, 4)

  if (!loading && articles.length === 0) return null

  return (
    <section className="mt-16 border-t border-[#e6e6e6] pt-10" aria-labelledby="related-heading">
      <h2 id="related-heading" className="mb-6 text-2xl font-semibold text-[#1c1c1c]">
        Related articles
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {loading
          ? [...Array(4)].map((_, i) => <Shimmer key={i} className="h-28" />)
          : articles.map((item) => (
              <article key={item.id} className="transform transition-transform duration-300 ease-out hover:-translate-y-0.5">
                <Link
                  to={`/article/${item.slug}`}
                  className="group flex gap-4 rounded-2xl border border-[#e6e6e6] bg-white p-4 transition hover:border-[#d0d0d0] hover:shadow-sm"
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt=""
                      loading="lazy"
                      className="h-20 w-24 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-20 w-24 shrink-0 rounded-xl bg-[#f1f1ef]" />
                  )}
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 font-semibold text-[#1c1c1c] transition-colors group-hover:text-[#1d4ed8]">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="mt-1 line-clamp-2 text-xs text-[#6b6b6b]">{item.excerpt}</p>
                    )}
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#8a8a8a]">
                      <Clock className="h-3 w-3" />
                      {getArticleReadingTime(item)} min read
                    </span>
                  </div>
                </Link>
              </article>
            ))}
      </div>
    </section>
  )
}
