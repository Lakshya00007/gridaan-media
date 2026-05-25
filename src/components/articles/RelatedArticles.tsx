import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { motion } from 'framer-motion'
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
    <section className="mt-16 border-t border-[#1E293B]/50 pt-12" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-2xl font-bold text-[#F8FAFC] mb-6">
        Related articles
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {loading
          ? [...Array(4)].map((_, i) => <Shimmer key={i} className="h-28" />)
          : articles.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/article/${item.slug}`}
                  className="group flex gap-4 rounded-2xl border border-[#1E293B]/50 bg-[#0B1224]/60 p-4 transition hover:border-[#2563EB]/40 hover:bg-[#0B1224]/90"
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt=""
                      loading="lazy"
                      className="h-20 w-24 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-20 w-24 shrink-0 rounded-xl bg-linear-to-br from-[#2563EB]/30 to-[#14B8A6]/20" />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#F8FAFC] line-clamp-2 group-hover:text-[#14B8A6] transition-colors">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="mt-1 text-xs text-[#64748B] line-clamp-2">{item.excerpt}</p>
                    )}
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#94A3B8]">
                      <Clock className="h-3 w-3" />
                      {getArticleReadingTime(item)} min read
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
      </div>
    </section>
  )
}
