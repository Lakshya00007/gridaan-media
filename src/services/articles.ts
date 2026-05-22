import { supabase } from '../lib/supabase'
import { publicUrlToPath, removeImageFile } from './uploadService'

export interface ArticleRecord {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  image_url?: string | null
  category?: string
  author?: string
  created_at?: string
}

export interface ArticlePayload {
  id?: string
  title: string
  slug: string
  content: string
  excerpt?: string
  image_url?: string | null
  category?: string
  author?: string
}

export async function getArticles(): Promise<ArticleRecord[] | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('getArticles error', error)
      return null
    }

    return data as ArticleRecord[]
  } catch (err) {
    console.error('getArticles unexpected error', err)
    return null
  }
}

export async function getArticleBySlug(slug: string): Promise<ArticleRecord | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('getArticleBySlug error', error)
      return null
    }

    return data as ArticleRecord
  } catch (err) {
    console.error('getArticleBySlug unexpected error', err)
    return null
  }
}

export async function createArticle(payload: ArticlePayload): Promise<ArticleRecord | null> {
  try {
    const { data, error } = await supabase.from('articles').insert([payload]).select('*').single()
    if (error) {
      console.error('createArticle error', error)
      return null
    }
    return data as ArticleRecord
  } catch (err) {
    console.error('createArticle unexpected error', err)
    return null
  }
}

export async function updateArticle(id: string, updates: Partial<ArticlePayload>): Promise<ArticleRecord | null> {
  try {
    const { data, error } = await supabase.from('articles').update(updates).eq('id', id).select('*').single()
    if (error) {
      console.error('updateArticle error', error)
      return null
    }
    return data as ArticleRecord
  } catch (err) {
    console.error('updateArticle unexpected error', err)
    return null
  }
}

export async function deleteArticle(id: string): Promise<boolean> {
  try {
    // fetch image_url first
    const { data: article, error: fetchError } = await supabase.from('articles').select('image_url').eq('id', id).single()
    if (fetchError) {
      console.error('deleteArticle fetch error', fetchError)
      return false
    }

    const imageUrl: string | null = (article as any)?.image_url ?? null

    const { error } = await supabase.from('articles').delete().eq('id', id)
    if (error) {
      console.error('deleteArticle delete error', error)
      return false
    }

    if (imageUrl) {
      try {
        const path = publicUrlToPath(imageUrl)
        if (path) await removeImageFile(path)
      } catch (removeErr) {
        console.error('deleteArticle: failed to remove image from storage', removeErr)
      }
    }

    return true
  } catch (err) {
    console.error('deleteArticle unexpected error', err)
    return false
  }
}
