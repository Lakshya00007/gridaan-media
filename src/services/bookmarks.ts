import { supabase } from '../lib/supabase'
import { getCurrentUser } from './profiles'

export interface BookmarkRecord {
  id: string
  user_id: string
  article_id: string
  created_at: string
}

export async function getBookmarks(userId: string): Promise<BookmarkRecord[]> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id, user_id, article_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getBookmarks error', error)
    throw error
  }

  return (data ?? []) as BookmarkRecord[]
}

export async function createBookmark(articleId: string): Promise<BookmarkRecord> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Please sign in to bookmark articles.')
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .insert({ user_id: user.id, article_id: articleId })
    .select('id, user_id, article_id, created_at')
    .single()

  if (error) {
    console.error('createBookmark error', error)
    throw error
  }

  return data as BookmarkRecord
}

export async function deleteBookmark(articleId: string): Promise<void> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Please sign in to manage bookmarks.')
  }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', user.id)
    .eq('article_id', articleId)

  if (error) {
    console.error('deleteBookmark error', error)
    throw error
  }
}
