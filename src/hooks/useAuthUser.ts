import { useQuery } from '@tanstack/react-query'
import type { Session, User } from '@supabase/supabase-js'
import { getCurrentUser, getProfile, type Profile } from '../services/profiles'

export const authKeys = {
  user: ['auth', 'user'] as const,
  session: ['auth', 'session'] as const,
  profile: ['profile'] as const,
  profileByUser: (userId: string) => ['profile', userId] as const,
}

export function useAuthUser() {
  const userQuery = useQuery<User | null>({
    queryKey: authKeys.user,
    queryFn: getCurrentUser,
    staleTime: 60 * 1000,
    retry: false,
  })

  const sessionQuery = useQuery<Session | null>({
    queryKey: authKeys.session,
    queryFn: async () => null,
    enabled: false,
    staleTime: Infinity,
    retry: false,
  })

  const user = userQuery.data ?? null

  const profileQuery = useQuery<Profile | null>({
    queryKey: authKeys.profileByUser(user?.id ?? ''),
    queryFn: () => getProfile(user!.id),
    enabled: Boolean(user?.id),
    staleTime: 60 * 1000,
    retry: false,
  })

  const profile = profileQuery.data ?? null
  const session = sessionQuery.data ?? null
  const loading = userQuery.isPending || (!!user?.id && profileQuery.isLoading)

  return {
    user,
    session,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
  }
}
