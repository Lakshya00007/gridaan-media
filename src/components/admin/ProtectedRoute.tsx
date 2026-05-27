import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthUser } from '../../hooks/useAuthUser'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuthUser()
  const location = useLocation()

  // Wait until profile fetch completes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-text">
        <div className="rounded-2xl border border-border bg-card px-6 py-4 shadow-sm animate-pulse">
          Verifying admin session...
        </div>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  // Logged in but not admin
  if (!isAdmin) {
    console.warn('[ProtectedRoute] User is not an admin:', user.email)
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}