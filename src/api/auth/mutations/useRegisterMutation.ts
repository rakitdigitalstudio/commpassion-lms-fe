import { register } from '@/api/auth/service/auth'
import type { RegisterPayload } from '@/api/auth/types'
import { useApiMutation, type ApiMutationOptions } from '@/api/core/useApiMutation'

/**
 * Wraps register(). No cache writes: registering doesn't start a session
 * (the user signs in separately afterward), so queryKeys.me() is unchanged.
 */
export function useRegisterMutation(options?: ApiMutationOptions<void, RegisterPayload>) {
  // useRegisterForm shows its own inline error.
  return useApiMutation(register, { suppressErrorToast: true, ...options })
}
