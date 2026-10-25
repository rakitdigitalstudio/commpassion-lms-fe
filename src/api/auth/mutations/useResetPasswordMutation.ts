import { resetPassword } from '@/api/auth/service/auth'
import type { ResetPasswordPayload } from '@/api/auth/types'
import { useApiMutation, type ApiMutationOptions } from '@/api/core/useApiMutation'

/** One hook per resource, per README "Data fetching" — wraps resetPassword(). */
export function useResetPasswordMutation(options?: ApiMutationOptions<void, ResetPasswordPayload>) {
  // useResetPasswordForm shows its own inline error.
  return useApiMutation(resetPassword, { suppressErrorToast: true, ...options })
}
