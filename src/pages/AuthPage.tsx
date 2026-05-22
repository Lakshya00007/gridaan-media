import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'

export default function AuthPage() {
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
        />
      </div>
    </div>
  )
}
