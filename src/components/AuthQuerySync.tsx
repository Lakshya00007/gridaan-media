import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { authKeys } from '../hooks/useAuthUser'

export default function AuthQuerySync() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthQuerySync] onAuthStateChange', event, session?.user?.email)
      queryClient.setQueryData(authKeys.user, session?.user ?? null)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
    })

    return () => {
      listener.subscription?.unsubscribe?.()
    }
  }, [queryClient])

  return null
}
