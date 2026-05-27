import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { authKeys } from '../hooks/useAuthUser'

/**
 * AuthQuerySync now reads auth state from AuthContext and mirrors it
 * into the react-query cache. The single Supabase listener stays in
 * AuthProvider to avoid duplicate subscriptions and race conditions.
 */
export default function AuthQuerySync() {
  const queryClient = useQueryClient()
  const { session, user, profile } = useAuth()

  useEffect(() => {
    queryClient.setQueryData(authKeys.user, user ?? null)
    queryClient.setQueryData(authKeys.session, session ?? null)

    if (profile) {
      queryClient.setQueryData(authKeys.profileByUser(profile.id), profile)
    } else {
      queryClient.removeQueries({ queryKey: authKeys.profile })
    }

    queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
  }, [queryClient, session, user, profile])

  return null
}
