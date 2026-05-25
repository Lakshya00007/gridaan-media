import { supabase } from '../lib/supabase'
import type { Comment } from '../types/comment'

interface CommentRow {
  id: string
  article_id: string
  user_id: string
  parent_id: string | null
  content: string
  created_at: string
  updated_at: string
}

function mapRow(row: CommentRow): Comment {
  return {
    id: row.id,
    article_id: row.article_id,
    user_id: row.user_id,
    parent_id: row.parent_id,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author_name: 'Community member',
  }
}

export async function getCommentsByArticle(articleId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('id, article_id, user_id, parent_id, content, created_at, updated_at')
    .eq('article_id', articleId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[getCommentsByArticle]', error)
    throw new Error(error.message)
  }

  const flat = (data ?? []).map((row) => mapRow(row as CommentRow))
  return nestComments(flat)
}

function nestComments(flat: Comment[]): Comment[] {
  const byId = new Map<string, Comment>()
  const roots: Comment[] = []

  for (const c of flat) {
    byId.set(c.id, { ...c, replies: [] })
  }

  for (const c of byId.values()) {
    if (c.parent_id && byId.has(c.parent_id)) {
      byId.get(c.parent_id)!.replies!.push(c)
    } else {
      roots.push(c)
    }
  }

  return roots
}

export async function createComment(input: {
  articleId: string
  userId: string
  content: string
  parentId?: string | null
}): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      article_id: input.articleId,
      user_id: input.userId,
      content: input.content.trim(),
      parent_id: input.parentId ?? null,
    })
    .select('id, article_id, user_id, parent_id, content, created_at, updated_at')
    .single()

  if (error) {
    console.error('[createComment]', error)
    throw new Error(error.message)
  }

  return mapRow(data as CommentRow)
}

export async function deleteComment(id: string): Promise<void> {
  const { error } = await supabase.from('comments').delete().eq('id', id)
  if (error) {
    console.error('[deleteComment]', error)
    throw new Error(error.message)
  }
}
