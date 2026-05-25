import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthUser } from '../../hooks/useAuthUser'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthUser()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080d1a] text-white">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-4">
          Checking permissions...
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
