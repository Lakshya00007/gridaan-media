import { useEffect, useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../lib/supabase'
import { getProfile } from '../../services/profiles'

export default function LoginPage() {
  const [checking, setChecking] = useState(true)

  const redirectTo = `${window.location.origin}${window.location.pathname}#/dashboard`

  useEffect(() => {
    let mounted = true

    const handleSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error(
            '[LoginPage] Session error:',
            error
          )

          if (mounted) {
            setChecking(false)
          }

          return
        }

        // no session
        if (!session?.user) {
          if (mounted) {
            setChecking(false)
          }

          return
        }

        console.log(
          '[LoginPage] Session user:',
          session.user.email
        )

        // fetch profile safely
        const profile = await getProfile(
          session.user.id
        )

        console.log(
          '[LoginPage] Profile:',
          profile
        )

        // profile not ready yet
        if (!profile) {
          console.warn(
            '[LoginPage] Profile not created yet'
          )

          if (mounted) {
            setChecking(false)
          }

          // safe fallback
          window.location.hash = '#/'
          return
        }

        // admin redirect
        if (profile.role === 'admin') {
          window.location.hash = '#/dashboard'
          return
        }

        // normal user redirect
        window.location.hash = '#/'
      } catch (error) {
        console.error(
          '[LoginPage] Fatal auth error:',
          error
        )

        if (mounted) {
          setChecking(false)
        }
      }
    }

    handleSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(
          '[LoginPage] Auth changed:',
          event,
          session?.user?.email
        )

        if (!mounted) return

        // signed out
        if (!session?.user) {
          setChecking(false)
          return
        }

        // signed in
        await handleSession()
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060A16] text-white">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-4">
          Preparing sign in...
        </div>
      </div>
    )
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