import { useApiMutation } from '@/hooks/useApiMutation'
import { useApiQuery } from '@/hooks/useApiQuery'
import { getMe, login, logout, UnauthenticatedError } from '@/lib/api/auth'
import type { LoginPayload, User } from '@/lib/api/auth.types'
import {
  clearDemoSession,
  isDemoAccountEmail,
  loadDemoSession,
  saveDemoSession,
} from '@/lib/demo-account'
import { queryKeys } from '@/lib/query-keys'

export interface UserAuthenticationValue {
  user: User | null
  /** True only while the initial getMe() session check is in flight. */
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
}

async function fetchCurrentUser(): Promise<User | null> {
  // Demo account bypass (see src/lib/demo-account.ts) — checked first so
  // it survives a reload even though the mock backend's own session
  // doesn't.
  const demoUser = loadDemoSession()
  if (demoUser) {
    return demoUser
  }

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
      const { user } = await loginMutation.mutateAsync(payload)

      // Clear first so switching from the demo account to a real one (or
      // vice versa) never leaves a stale session shadowing the new one.
      clearDemoSession()
      if (isDemoAccountEmail(payload.email)) {
        saveDemoSession(user)
      }
    },
    logout: async () => {
      clearDemoSession()
      await logoutMutation.mutateAsync()
    },
  }
}
