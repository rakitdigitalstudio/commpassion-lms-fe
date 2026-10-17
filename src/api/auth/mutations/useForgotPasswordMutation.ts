import { forgotPassword } from '@/api/auth/service/auth'
import type { ForgotPasswordPayload } from '@/api/auth/types'
import { useApiMutation, type ApiMutationOptions } from '@/api/core/useApiMutation'

/** One hook per resource, per README "Data fetching" — wraps forgotPassword(). */
export function useForgotPasswordMutation(
  options?: ApiMutationOptions<void, ForgotPasswordPayload>,
) {
  // Never surface a failure — the form must not reveal whether an email
  // exists (Ticket #11), see useForgotPasswordForm.
  return useApiMutation(forgotPassword, { suppressErrorToast: true, ...options })
}
