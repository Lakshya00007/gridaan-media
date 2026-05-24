import { supabase } from './supabase'

export const signInWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}${window.location.pathname}#/dashboard`,
    }
  })
}

export const signOut = async () => {
  await supabase.auth.signOut()
}
