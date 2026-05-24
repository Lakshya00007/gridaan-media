import { ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getProfile } from '../../services/profiles'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authState, setAuthState] = useState<'loading' | 'authorized' | 'unauthenticated' | 'unauthorized'>('loading')
  const location = useLocation()

  useEffect(() => {
    let isMounted = true
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase()

    const verifySession = async (userId?: string, sessionEmail?: string | null) => {
      if (!isMounted) return
      const userEmail = sessionEmail?.trim().toLowerCase()
      const profile = userId ? await getProfile(userId) : null
      if (!isMounted) return
      const nextState = !sessionEmail
        ? 'unauthenticated'
        : profile?.role === 'admin'
          ? 'authorized'
          : 'unauthorized'

      console.log('[ProtectedRoute] adminEmail=', adminEmail, 'userEmail=', userEmail, 'profileRole=', profile?.role, 'authState=', nextState)
      setAuthState(nextState)
    }

    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        console.log('[ProtectedRoute] getSession -> session?.user?.email=', session?.user?.email)
        await verifySession(session?.user?.id, session?.user?.email)
      } catch (error) {
        console.error('Auth error:', error)
        if (isMounted) {
          setAuthState('unauthenticated')
        }
      }
    }

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('[ProtectedRoute] onAuthStateChange', _event, session?.user?.email)
      await verifySession(session?.user?.id, session?.user?.email)
    })

    checkAuth()

    return () => {
      isMounted = false
      listener.subscription?.unsubscribe?.()
    }
  }, [])

  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060A16] text-white">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-4">
          Checking permissions...
        </div>
      </div>
    )
  }

  if (authState === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (authState === 'unauthorized') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
