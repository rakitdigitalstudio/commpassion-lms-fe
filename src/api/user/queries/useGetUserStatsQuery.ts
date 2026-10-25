import { queryKeys } from '@/api/core/query-keys'
import { useApiQuery, type ApiQueryOptions } from '@/api/core/useApiQuery'
import { getUserStats } from '@/api/user/service/user'
import type { UserStats } from '@/api/user/types'

export function useGetUserStatsQuery(
  options?: ApiQueryOptions<UserStats, ReturnType<typeof queryKeys.userStats>>,
) {
  return useApiQuery(queryKeys.userStats(), getUserStats, options)
}
