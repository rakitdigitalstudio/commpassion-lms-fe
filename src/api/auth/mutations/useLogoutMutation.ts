import { logout } from '@/api/auth/service/auth'
import { queryKeys } from '@/api/core/query-keys'
import { useApiMutation, type ApiMutationOptions } from '@/api/core/useApiMutation'
import { useQueryCache } from '@/api/core/useQueryCache'

/** One hook per resource, per README "Data fetching" — wraps logout(). */
export function useLogoutMutation(options?: ApiMutationOptions<void>) {
  const queryCache = useQueryCache()

  return useApiMutation(logout, {
    ...options,
    // We know the session is gone — write it directly instead of
    // invalidating and refetching getMe() for a value we already know.
    // The caller's onSuccess still runs afterward.
    onSuccess: (...args) => {
      queryCache.setData(queryKeys.me(), null)
      return options?.onSuccess?.(...args)
    },
  })
}
