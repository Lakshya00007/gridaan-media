import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const redirectTo = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
    ? `http://localhost:5173/#/dashboard`
    : `${window.location.origin}/#/dashboard`

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session) {
        navigate('/dashboard')
      }
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        navigate('/dashboard')
      }
    })

    return () => {
      listener.subscription?.unsubscribe?.()
    }
  }, [navigate])

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
