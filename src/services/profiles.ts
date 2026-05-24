import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface Profile {
  id: string
  email: string | null
  role: 'user' | 'admin'
  created_at?: string
  updated_at?: string
}

export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('getCurrentUser error', error)
    return null
  }

  return user
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('getProfile error', error)
    return null
  }

  return data as Profile | null
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser()
  if (!user) return null
  return getProfile(user.id)
}
