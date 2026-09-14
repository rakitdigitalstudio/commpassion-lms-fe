import { useApiMutation } from '@/hooks/useApiMutation'
import { login } from '@/lib/api/auth'
import { queryKeys } from '@/lib/query-keys'

/** One hook per resource, per README "Data fetching" — wraps login(). */
export function useLoginMutation() {
  return useApiMutation(login, { invalidateKeys: [queryKeys.me()] })
}
