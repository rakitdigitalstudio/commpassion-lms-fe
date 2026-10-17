import { getMe, UnauthenticatedError } from '@/api/auth/service/auth'
import type { User } from '@/api/auth/types'
import { queryKeys } from '@/api/core/query-keys'
import { useApiQuery } from '@/api/core/useApiQuery'

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
export function useGetUserDataQuery() {
  return useApiQuery(queryKeys.me(), fetchCurrentUser, { retry: false })
}
