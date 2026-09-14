import { useGetMeQuery } from '@/hooks/useGetMeQuery'
import { useLoginMutation } from '@/hooks/useLoginMutation'
import { useLogoutMutation } from '@/hooks/useLogoutMutation'
import type { LoginPayload, User } from '@/lib/api/auth.types'
import { clearDemoSession, isDemoAccountEmail, saveDemoSession } from '@/lib/demo-account'

export interface UserAuthenticationValue {
  user: User | null
  /** True only while the initial getMe() session check is in flight. */
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
}

/**
 * Actual auth logic — composes the per-resource query/mutation hooks
 * (useGetMeQuery/useLoginMutation/useLogoutMutation, per README "Data
 * fetching") into the single value UserAuthenticationContext exposes. Kept
 * separate from that context so the context file only ever has to wire
 * `const value = useUserAuthentication()` into a provider.
 */
export function useUserAuthentication(): UserAuthenticationValue {
  const { data: user, isLoading } = useGetMeQuery()
  const { mutateAsync: handleLogin } = useLoginMutation()
  const { mutateAsync: handleLogout } = useLogoutMutation()

  return {
    user: user ?? null,
    isLoading,
    login: async (payload) => {
      const { user: loggedInUser } = await handleLogin(payload)

      // Clear first so switching from the demo account to a real one (or
      // vice versa) never leaves a stale session shadowing the new one.
      clearDemoSession()
      if (isDemoAccountEmail(payload.email)) {
        saveDemoSession(loggedInUser)
      }
    },
    logout: async () => {
      clearDemoSession()
      await handleLogout()
    },
  }
}
