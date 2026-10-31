import { queryKeys } from '@/api/core/query-keys'
import { useApiMutation, type ApiMutationOptions } from '@/api/core/useApiMutation'
import { setIsNewUser } from '@/api/user/service/user'

/** Toggles the post-login introduction video. Refreshes `me` so user.isNewUser updates everywhere. */
export function useSetIsNewUserMutation(options?: ApiMutationOptions<void, boolean>) {
  return useApiMutation(setIsNewUser, {
    invalidateKeys: [queryKeys.me()],
    ...options,
  })
}
