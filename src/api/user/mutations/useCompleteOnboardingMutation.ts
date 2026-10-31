import { queryKeys } from '@/api/core/query-keys'
import { useApiMutation, type ApiMutationOptions } from '@/api/core/useApiMutation'
import { completeOnboarding } from '@/api/user/service/user'

/** Dismisses the post-login introduction video. Refreshes `me` so user.isNewUser updates everywhere. */
export function useCompleteOnboardingMutation(options?: ApiMutationOptions<void, void>) {
  return useApiMutation(completeOnboarding, {
    invalidateKeys: [queryKeys.me()],
    ...options,
  })
}
