import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthUser } from '../../hooks/useAuthUser'
import { useUI } from '../../context/UIContext'

export default function LoginPage() {
  const { user, loading } = useAuthUser()
  const { darkMode } = useUI()
  const redirectTo = window.location.origin

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-text">
        <div className="rounded-2xl border border-border bg-card px-6 py-4 shadow-sm animate-pulse">
          Preparing sign in...
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 transition-colors">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-text">
            Welcome to Gridaan
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Continue with your admin account
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb',
                  brandAccent: '#1d4ed8',
                }
              }
            }
          }}
          providers={['google']}
          theme={darkMode ? 'dark' : 'default'}
          redirectTo={redirectTo}
        />
      </div>
    </div>
  )
}
