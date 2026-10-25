import { login } from '@/api/auth/service/auth'
import type { AuthResponse, LoginPayload } from '@/api/auth/types'
import { queryKeys } from '@/api/core/query-keys'
import { useApiMutation, type ApiMutationOptions } from '@/api/core/useApiMutation'
import { useQueryCache } from '@/api/core/useQueryCache'

/** One hook per resource, per README "Data fetching" — wraps login(). */
export function useLoginMutation(options?: ApiMutationOptions<AuthResponse, LoginPayload>) {
  const queryCache = useQueryCache()

  return useApiMutation(login, {
    // useLoginForm shows its own inline error.
    suppressErrorToast: true,
    ...options,
    // We already have the fresh user right here in the response — write
    // it straight into the cache instead of invalidating queryKeys.me()
    // and refetching a value we already know. The caller's onSuccess
    // still runs afterward.
    onSuccess: (data, ...rest) => {
      queryCache.setData(queryKeys.me(), data.user)
      return options?.onSuccess?.(data, ...rest)
    },
  })
}
