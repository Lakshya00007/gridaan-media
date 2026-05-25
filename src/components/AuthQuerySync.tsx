import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { authKeys } from '../hooks/useAuthUser'

function syncAuthToCache(queryClient: ReturnType<typeof useQueryClient>, session: Session | null) {
  queryClient.setQueryData(authKeys.user, session?.user ?? null)
  queryClient.setQueryData(authKeys.session, session)

  if (session?.user?.id) {
    queryClient.invalidateQueries({ queryKey: authKeys.profile })
  } else {
    queryClient.removeQueries({ queryKey: authKeys.profile })
  }

  queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
}

export default function AuthQuerySync() {
  const queryClient = useQueryClient()

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        syncAuthToCache(queryClient, session)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      syncAuthToCache(queryClient, session)
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [queryClient])

  return null
}
