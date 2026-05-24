import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../lib/supabase'
import { getProfile } from '../../services/profiles'

export default function LoginPage() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase()
  const redirectTo = `${window.location.origin}${window.location.pathname}#/dashboard`

  useEffect(() => {
    let isMounted = true

    const routeSession = async (userId?: string, userEmail?: string | null) => {
      const normalizedEmail = userEmail?.trim().toLowerCase()
      const profile = userId ? await getProfile(userId) : null
      if (!isMounted) return
      const isAdmin = profile?.role === 'admin'

      console.log('[LoginPage] adminEmail=', adminEmail, 'userEmail=', normalizedEmail, 'profileRole=', profile?.role, 'isAdmin=', isAdmin)

      if (!userEmail) {
        if (isMounted) setChecking(false)
        return
      }

      navigate(isAdmin ? '/dashboard' : '/', { replace: true })
    }

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      await routeSession(data?.session?.user?.id, data?.session?.user?.email)
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[LoginPage] onAuthStateChange', event, session?.user?.email)
      await routeSession(session?.user?.id, session?.user?.email)
    })

    return () => {
      isMounted = false
      listener.subscription?.unsubscribe?.()
    }
  }, [adminEmail, navigate])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-4">
          Preparing sign in...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-6 bg-zinc-900 rounded-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Welcome to Gridaan
        </h1>

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          theme="dark"
          redirectTo={redirectTo}
        />
      </div>
    </div>
  )
}
