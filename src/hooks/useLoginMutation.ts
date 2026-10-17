import { login } from '@/api/auth/service/auth'
import { queryKeys } from '@/api/core/query-keys'
import { useApiMutation } from '@/api/core/useApiMutation'
import { useQueryCache } from '@/api/core/useQueryCache'

/** One hook per resource, per README "Data fetching" — wraps login(). */
export function useLoginMutation() {
  const queryCache = useQueryCache()

  return useApiMutation(login, {
    // useLoginForm shows its own inline error.
    suppressErrorToast: true,
    // We already have the fresh user right here in the response — write
    // it straight into the cache instead of invalidating queryKeys.me()
    // and refetching a value we already know.
    onSuccess: (data) => {
      queryCache.setData(queryKeys.me(), data.user)
    },
  })
}
