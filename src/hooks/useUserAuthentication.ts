import { useLoginMutation } from '@/api/auth/mutations/useLoginMutation'
import { useLogoutMutation } from '@/api/auth/mutations/useLogoutMutation'
import { useGetUserDataQuery } from '@/api/auth/queries/useGetUserDataQuery'
import type { LoginPayload, User } from '@/api/auth/types'

export interface UserAuthenticationValue {
  user: User | null
  /** True only while the initial getMe() session check is in flight. */
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
}

/**
 * Actual auth logic — composes the per-resource query/mutation hooks
 * (useGetUserDataQuery/useLoginMutation/useLogoutMutation, per README "Data
 * fetching") into the single value UserAuthenticationContext exposes. Kept
 * separate from that context so the context file only ever has to wire
 * `const value = useUserAuthentication()` into a provider.
 */
export function useUserAuthentication(): UserAuthenticationValue {
  const { data: user, isLoading } = useGetUserDataQuery()
  const { mutateAsync: handleLogin } = useLoginMutation()
  const { mutateAsync: handleLogout } = useLogoutMutation()

  return {
    user: user ?? null,
    isLoading,
    login: async (payload) => {
      await handleLogin(payload)
    },
    logout: async () => {
      await handleLogout()
    },
  }
}
