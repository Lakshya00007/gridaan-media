import { supabase } from '../lib/supabase'
import type { Article } from '../types/article'
import { publicUrlToPath, removeImageFile } from './uploadService'

export type ArticlePayload = Omit<Article, 'id' | 'created_at'> & { id?: string }

export async function getArticles(): Promise<Article[] | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('getArticles error', error)
      return null
    }

    return data as Article[]
  } catch (err) {
    console.error('getArticles unexpected error', err)
    return null
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
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

    return data as Article
  } catch (err) {
    console.error('getArticleBySlug unexpected error', err)
    return null
  }
}

export async function createArticle(payload: ArticlePayload): Promise<Article | null> {
  try {
    const { data, error } = await supabase.from('articles').insert([payload]).select('*').single()
    if (error) {
      console.error('createArticle error', error)
      return null
    }
    return data as Article
  } catch (err) {
    console.error('createArticle unexpected error', err)
    return null
  }
}

export async function updateArticle(id: string, updates: Partial<ArticlePayload>): Promise<Article | null> {
  try {
    const { data, error } = await supabase.from('articles').update(updates).eq('id', id).select('*').single()
    if (error) {
      console.error('updateArticle error', error)
      return null
    }
    return data as Article
  } catch (err) {
    console.error('updateArticle unexpected error', err)
    return null
  }
}

export async function deleteArticle(id: string): Promise<boolean> {
  try {
    // fetch image_url first
    const { data, error: fetchError } = await supabase.from('articles').select('image_url').eq('id', id).single()
    if (fetchError) {
      console.error('deleteArticle fetch error', fetchError)
      return false
    }

    const article = data as Pick<Article, 'image_url'> | null
    const imageUrl = article?.image_url ?? null

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
