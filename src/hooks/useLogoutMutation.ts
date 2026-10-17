import { logout } from '@/api/auth/service/auth'
import { queryKeys } from '@/api/core/query-keys'
import { useApiMutation } from '@/api/core/useApiMutation'
import { useQueryCache } from '@/api/core/useQueryCache'

/** One hook per resource, per README "Data fetching" — wraps logout(). */
export function useLogoutMutation() {
  const queryCache = useQueryCache()

  return useApiMutation(logout, {
    // We know the session is gone — write it directly instead of
    // invalidating and refetching getMe() for a value we already know.
    onSuccess: () => {
      queryCache.setData(queryKeys.me(), null)
    },
  })
}
