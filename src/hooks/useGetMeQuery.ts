import { useApiQuery } from '@/hooks/useApiQuery'
import { getMe, UnauthenticatedError } from '@/lib/api/auth'
import type { User } from '@/lib/api/auth.types'
import { loadDemoSession } from '@/lib/demo-account'
import { queryKeys } from '@/lib/query-keys'

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

/** One hook per resource, per README "Data fetching" — wraps getMe(). */
export function useGetMeQuery() {
  return useApiQuery(queryKeys.me(), fetchCurrentUser, { retry: false })
}
