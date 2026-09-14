import { useApiMutation } from '@/hooks/useApiMutation'
import { logout } from '@/lib/api/auth'
import { queryKeys } from '@/lib/query-keys'

/** One hook per resource, per README "Data fetching" — wraps logout(). */
export function useLogoutMutation() {
  return useApiMutation(logout, { invalidateKeys: [queryKeys.me()] })
}
