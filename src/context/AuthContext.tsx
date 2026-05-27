import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { getProfile, type Profile } from '../services/profiles'
import { authKeys } from '../hooks/useAuthUser'

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = useMemo(() => profile?.role === 'admin', [profile])

  useEffect(() => {
    let isMounted = true

    // Fetch initial session
    const initSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        if (!isMounted) return

        if (initialSession) {
          setSession(initialSession)
          setUser(initialSession.user)
          
          // Sync with react-query cache
          queryClient.setQueryData(authKeys.user, initialSession.user)
          queryClient.setQueryData(authKeys.session, initialSession)

          // Fetch profile
          const userProfile = await getProfile(initialSession.user.id)
          if (isMounted) {
            setProfile(userProfile)
            if (userProfile) {
              queryClient.setQueryData(authKeys.profileByUser(initialSession.user.id), userProfile)
            }
          }
        }
      } catch (err) {
        console.error('[AuthProvider] Error getting initial session:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!isMounted) return
      setLoading(true)

      const currentUser = currentSession?.user ?? null
      setSession(currentSession)
      setUser(currentUser)

      // Sync React Query cache
      queryClient.setQueryData(authKeys.user, currentUser)
      queryClient.setQueryData(authKeys.session, currentSession)
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })

      if (currentUser) {
        try {
          const userProfile = await getProfile(currentUser.id)
          if (isMounted) {
            setProfile(userProfile)
            if (userProfile) {
              queryClient.setQueryData(authKeys.profileByUser(currentUser.id), userProfile)
            }
          }
        } catch (err) {
          console.error('[AuthProvider] Profile fetch failed on change:', err)
          if (isMounted) setProfile(null)
        } finally {
          if (isMounted) setLoading(false)
        }
      } else {
        setProfile(null)
        queryClient.removeQueries({ queryKey: authKeys.profile })
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [queryClient])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    profile,
    loading,
    isAdmin,
  }), [user, session, profile, loading, isAdmin])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
