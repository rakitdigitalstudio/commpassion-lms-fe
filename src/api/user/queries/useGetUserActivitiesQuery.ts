import { queryKeys } from '@/api/core/query-keys'
import { useApiQuery, type ApiQueryOptions } from '@/api/core/useApiQuery'
import { getUserActivities } from '@/api/user/service/user'
import type { UserActivity } from '@/api/user/types'

export function useGetUserActivitiesQuery(
  options?: ApiQueryOptions<UserActivity[], ReturnType<typeof queryKeys.userActivities>>,
) {
  return useApiQuery(queryKeys.userActivities(), getUserActivities, options)
}
