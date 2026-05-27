import { useAuth } from '../context/AuthContext'

export const authKeys = {
  user: ['auth', 'user'] as const,
  session: ['auth', 'session'] as const,
  profile: ['profile'] as const,
  profileByUser: (userId: string) => ['profile', userId] as const,
}

export function useAuthUser() {
  const auth = useAuth()
  return {
    user: auth.user,
    session: auth.session,
    profile: auth.profile,
    loading: auth.loading,
    isAdmin: auth.isAdmin,
  }
}
