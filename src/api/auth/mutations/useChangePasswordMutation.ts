import { changePassword } from '@/api/auth/service/auth'
import type { ChangePasswordPayload } from '@/api/auth/types'
import { useApiMutation, type ApiMutationOptions } from '@/api/core/useApiMutation'

/** One hook per resource, per README "Data fetching" — wraps changePassword(). */
export function useChangePasswordMutation(
  options?: ApiMutationOptions<void, ChangePasswordPayload>,
) {
  // useChangePasswordForm shows its own inline/field errors.
  return useApiMutation(changePassword, { suppressErrorToast: true, ...options })
}
