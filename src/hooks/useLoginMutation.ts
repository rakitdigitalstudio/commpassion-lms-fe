import { useQueryClient } from '@tanstack/react-query'

import { useApiMutation } from '@/hooks/useApiMutation'
import { login } from '@/lib/api/auth'
import type { AuthResponse, LoginPayload } from '@/lib/api/auth.types'
import { matchDemoAccount } from '@/lib/demo-account'
import { queryKeys } from '@/lib/query-keys'

/**
 * Checks the temporary demo account (src/lib/demo-account.ts) before
 * falling through to the real login() network call, so it works even
 * where there's no backend/mocks running at all — e.g. a production
 * deploy with VITE_USE_MOCKS unset, where login() would otherwise 404/
 * network-error before any credential could ever be checked.
 */
async function loginOrDemoAccount(payload: LoginPayload): Promise<AuthResponse> {
  const demoUser = matchDemoAccount(payload)
  if (demoUser) {
    return { user: demoUser }
  }

  return login(payload)
}

/** One hook per resource, per README "Data fetching" — wraps login(). */
export function useLoginMutation() {
  const queryClient = useQueryClient()

  return useApiMutation(loginOrDemoAccount, {
    // We already have the fresh user right here in the response — write
    // it straight into the cache instead of invalidating queryKeys.me()
    // and letting it refetch. That refetch would call the real getMe(),
    // which 401s for the demo account (there's no actual backend session
    // for it), and if that resolves after this, it silently clobbers the
    // just-logged-in user back to null.
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.me(), data.user)
    },
  })
}
