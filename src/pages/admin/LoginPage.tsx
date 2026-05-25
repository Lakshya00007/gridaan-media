import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthUser } from '../../hooks/useAuthUser'

export default function LoginPage() {
  const { user, loading } = useAuthUser()
  const redirectTo = `${window.location.origin}/#/dashboard`

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060A16] text-white">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-4">
          Preparing sign in...
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060A16] px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/40">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            Welcome to Gridaan
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Continue with your admin account
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
          }}
          providers={['google']}
          theme="dark"
          redirectTo={redirectTo}
        />
      </div>
    </div>
  )
}
