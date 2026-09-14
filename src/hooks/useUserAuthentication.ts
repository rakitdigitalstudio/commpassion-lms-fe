import { useApiMutation } from '@/hooks/useApiMutation'
import { useApiQuery } from '@/hooks/useApiQuery'
import { getMe, login, logout, UnauthenticatedError } from '@/lib/api/auth'
import type { LoginPayload, User } from '@/lib/api/auth.types'
import { queryKeys } from '@/lib/query-keys'

export interface UserAuthenticationValue {
  user: User | null
  /** True only while the initial getMe() session check is in flight. */
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
}

async function fetchCurrentUser(): Promise<User | null> {
  try {
    const { user } = await getMe()
    return user
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return null
    }
    throw error
  }
}

/**
 * Actual auth logic — session query + login/logout mutations. Kept
 * separate from `UserAuthenticationContext` so the context file only ever
 * has to wire `const value = useUserAuthentication()` into a provider.
 */
export function useUserAuthentication(): UserAuthenticationValue {
  const meQuery = useApiQuery(queryKeys.me(), fetchCurrentUser, { retry: false })

  const loginMutation = useApiMutation(login, { invalidateKeys: [queryKeys.me()] })
  const logoutMutation = useApiMutation(logout, { invalidateKeys: [queryKeys.me()] })

  return {
    user: meQuery.data ?? null,
    isLoading: meQuery.isLoading,
    login: async (payload) => {
      await loginMutation.mutateAsync(payload)
    },
    logout: async () => {
      await logoutMutation.mutateAsync()
    },
  }
}
