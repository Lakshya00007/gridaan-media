import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data?.session
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || ''
      if (!session) {
        setAuthorized(false)
        return
      }
      const email = session.user.email ?? ''
      if (adminEmail && email.toLowerCase() !== adminEmail.toLowerCase()) {
        setAuthorized(false)
        return
      }
      setAuthorized(true)
    }
    check()
  }, [])
  
  if (authorized === null) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="rounded-2xl bg-slate-900/80 p-6">
        Checking permissions…
      </div>
    </div>
  )
}

if (!authorized) {
  return <Navigate to="/login" replace />
}

return <>{children}</>
}