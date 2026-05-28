import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthUser } from '../../hooks/useAuthUser'
import AuthModal from '../../components/auth/AuthModal'
import TopicOnboarding, { hasCompletedTopicsOnboarding } from '../../components/auth/TopicOnboarding'

export default function LoginPage() {
  const { user, loading, isAdmin } = useAuthUser()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = window.location.origin

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
  const returnTo = from && from !== '/login' ? from : '/'

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
    if (isAdmin) return <Navigate to="/dashboard" replace />
    if (!hasCompletedTopicsOnboarding()) {
      return (
        <AuthModal
          open
          title="Pick your interests"
          subtitle="A few quick picks to tailor your feed."
          onClose={() => navigate(returnTo, { replace: true })}
        >
          <TopicOnboarding
            onComplete={() => {
              toast.success('Preferences saved.')
              navigate(returnTo, { replace: true })
            }}
          />
        </AuthModal>
      )
    }
    return <Navigate to={returnTo} replace />
  }

  const startOAuth = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    })
    if (error) {
      console.error('[LoginPage] OAuth error', error)
      toast.error('Unable to start sign-in. Please try again.')
    }
  }

  const startEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })
    if (error) {
      console.error('[LoginPage] Email sign-in error', error)
      toast.error('Unable to send sign-in link.')
      return
    }
    toast.success('Check your email for a sign-in link.')
  }

  return (
    <AuthModal
      open
      title="Welcome back"
      subtitle="Sign in to save stories, comment, and personalize your feed."
      onClose={() => navigate(returnTo, { replace: true })}
    >
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => startOAuth('google')}
          className="w-full rounded-full border border-[#e6e6e6] bg-white px-4 py-3 text-sm font-medium text-[#1c1c1c] shadow-sm transition hover:bg-[#f8f8f7]"
        >
          <span className="flex items-center justify-center gap-3">
            <span className="h-5 w-5 rounded-full bg-[#f1f5ff] text-[#1d4ed8] flex items-center justify-center text-xs font-semibold">
              G
            </span>
            Continue with Google
          </span>
        </button>

        <button
          type="button"
          onClick={() => startOAuth('github')}
          className="w-full rounded-full border border-[#e6e6e6] bg-white px-4 py-3 text-sm font-medium text-[#1c1c1c] shadow-sm transition hover:bg-[#f8f8f7]"
        >
          <span className="flex items-center justify-center gap-3">
            <span className="h-5 w-5 rounded-full bg-[#f5f5f2] text-[#242424] flex items-center justify-center text-xs font-semibold">
              GH
            </span>
            Continue with GitHub
          </span>
        </button>

        <EmailRow onSend={startEmail} />

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => navigate(returnTo, { replace: true })}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#6b6b6b] hover:text-[#1c1c1c]"
          >
            <X className="h-4 w-4" />
            Close
          </button>
        </div>
      </div>
    </AuthModal>
  )
}

function EmailRow({ onSend }: { onSend: (email: string) => Promise<void> }) {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async () => {
    const trimmed = email.trim()
    if (!trimmed) return
    setSending(true)
    try {
      await onSend(trimmed)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mt-2 rounded-3xl border border-[#e6e6e6] bg-[#fafaf9] p-3">
      <label className="block text-xs font-medium text-[#6b6b6b]">Continue with Email</label>
      <div className="mt-2 flex gap-2">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8a]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="h-11 w-full rounded-full border border-[#e6e6e6] bg-white pl-9 pr-4 text-sm text-[#1c1c1c] placeholder:text-[#8a8a8a] focus:border-[#2563eb] focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={sending || !email.trim()}
          className="h-11 rounded-full bg-[#1c1c1c] px-4 text-sm font-medium text-white transition hover:bg-[#2c2c2c] disabled:opacity-40"
        >
          {sending ? 'Sending…' : 'Send'}
        </button>
      </div>
      <p className="mt-2 text-[11px] text-[#8a8a8a]">
        We’ll email you a secure sign-in link.
      </p>
    </div>
  )
}
