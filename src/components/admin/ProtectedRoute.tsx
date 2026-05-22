import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase()
        const userEmail = session?.user?.email?.toLowerCase()

        if (session && userEmail === adminEmail) {
          setAuthorized(true)
        } else {
          setAuthorized(false)
        }
      } catch (error) {
        console.error('Auth error:', error)
        setAuthorized(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060A16] text-white">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-4">
          Checking permissions...
        </div>
      </div>
    )
  }

  if (!authorized) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
