export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  image_url?: string | null
  category?: string
  author?: string
  created_at?: string
  featured?: boolean
  trending?: boolean
  type?: string
  readingTime?: number
  views?: number
}
