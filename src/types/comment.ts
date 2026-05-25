export interface Comment {
  id: string
  article_id: string
  user_id: string
  parent_id: string | null
  content: string
  created_at: string
  updated_at: string
  author_email?: string | null
  author_name?: string | null
  replies?: Comment[]
}
