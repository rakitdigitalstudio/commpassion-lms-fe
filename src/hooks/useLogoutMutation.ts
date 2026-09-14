import { useQueryClient } from '@tanstack/react-query'

import { useApiMutation } from '@/hooks/useApiMutation'
import { logout } from '@/lib/api/auth'
import { queryKeys } from '@/lib/query-keys'

/** One hook per resource, per README "Data fetching" — wraps logout(). */
export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useApiMutation(logout, {
    // We know the session is gone — write it directly instead of
    // invalidating and refetching getMe() for a value we already know.
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.me(), null)
    },
  })
}
