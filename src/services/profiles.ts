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
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error(
        '[getCurrentUser] error:',
        error
      )
      return null
    }

    return user
  } catch (error) {
    console.error(
      '[getCurrentUser] fatal error:',
      error
    )

    return null
  }
}

export async function getProfile(
  userId: string
): Promise<Profile | null> {
  try {
    if (!userId) return null

    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 5000)
    )

    const queryPromise = supabase
      .from('profiles')
      .select('id, email, role, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle()

    const result = await Promise.race([
      queryPromise,
      timeoutPromise,
    ])

    // timeout fallback
    if (!result) {
      console.warn(
        '[getProfile] Timed out fetching profile'
      )

      return null
    }

    // Supabase response
    if ('error' in result && result.error) {
      console.error(
        '[getProfile] error:',
        result.error
      )

      return null
    }

    return result.data as Profile | null
  } catch (error) {
    console.error(
      '[getProfile] fatal error:',
      error
    )

    return null
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const user = await getCurrentUser()

    if (!user) return null

    return await getProfile(user.id)
  } catch (error) {
    console.error(
      '[getCurrentProfile] fatal error:',
      error
    )

    return null
  }
}