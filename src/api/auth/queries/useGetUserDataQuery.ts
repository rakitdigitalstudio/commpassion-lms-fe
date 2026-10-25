import { getMe, UnauthenticatedError } from '@/api/auth/service/auth'
import type { User } from '@/api/auth/types'
import { queryKeys } from '@/api/core/query-keys'
import { useApiQuery, type ApiQueryOptions } from '@/api/core/useApiQuery'

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

/** One hook per resource, per README "Data fetching" — wraps getMe(). */
export function useGetUserDataQuery(
  options?: ApiQueryOptions<User | null, ReturnType<typeof queryKeys.me>>,
) {
  return useApiQuery(queryKeys.me(), fetchCurrentUser, { retry: false, ...options })
}
