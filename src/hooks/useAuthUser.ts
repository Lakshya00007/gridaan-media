import { useQuery } from '@tanstack/react-query'
import type { User } from '@supabase/supabase-js'
import { getCurrentUser } from '../services/profiles'

export const authKeys = {
  user: ['auth', 'user'] as const,
}

export function useAuthUser() {
  return useQuery<User | null>({
    queryKey: authKeys.user,
    queryFn: getCurrentUser,
    staleTime: 60 * 1000,
    retry: false,
  })
}
