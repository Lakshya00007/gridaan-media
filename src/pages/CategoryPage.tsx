import { useParams, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import ArticleCard from '../components/articles/ArticleCard'
import AdBanner from '../components/ads/AdBanner'
import Skeleton from '../components/ui/Skeleton'
import SEO from '../components/seo/SEO'
import { useArticles, useCategories } from '../hooks/useArticles'
import { slugifyCategory } from '../utils/articleUtils'

export default function CategoryPage() {
  const { slug } = useParams()
  const { data: articles = [], isLoading: articlesLoading, error: articlesError } = useArticles()
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories()
  const loading = articlesLoading || categoriesLoading
  const error = articlesError || categoriesError
  const category = categories.find((c) => c.slug === slug)
  
  const categoryArticles = articles.filter((a) => {
    return slugifyCategory(a.category) === slug
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="bg-white border-b border-border text-text">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <Skeleton className="h-4 w-64 mb-6" />
            <Skeleton className="h-12 w-80" />
            <Skeleton className="h-5 w-56 mt-3" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => <Skeleton key={index} className="h-[320px]" />)}
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center bg-bg text-text">
        <h1 className="text-2xl font-bold text-text mb-4">Category Not Found</h1>
        {error && <p className="text-text-secondary mb-4">Unable to load this category right now.</p>}
        <Link to="/categories" className="text-primary hover:underline">Browse all categories</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SEO 
        title={`${category.name} Articles`}
        description={category.description || `Browse technology articles in the ${category.name} category.`}
      />

      {/* Header */}
      <div className="bg-white border-b border-border text-text">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-xs text-text-secondary mb-4 font-semibold overflow-x-auto whitespace-nowrap pb-1">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden />
            <Link to="/categories" className="hover:text-primary">Categories</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden />
            <span className="text-text-secondary">{category.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{category.icon}</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">{category.name}</h1>
              <p className="text-xs text-text-secondary mt-1">{category.description} · {categoryArticles.length} articles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdBanner position="header" className="mb-8" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {categoryArticles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-secondary text-sm">No articles in this category yet.</p>
            <Link to="/" className="text-primary hover:underline mt-2 inline-block text-xs font-bold">Browse all articles</Link>
          </div>
        )}
      </div>
    </div>
  )
}
