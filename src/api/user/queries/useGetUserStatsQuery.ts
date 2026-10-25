import { queryKeys } from '@/api/core/query-keys'
import { useApiQuery, type ApiQueryOptions } from '@/api/core/useApiQuery'
import { getUserStats } from '@/api/user/service/user'
import type { UserStat } from '@/api/user/types'

export function useGetUserStatsQuery(
  options?: ApiQueryOptions<UserStat[], ReturnType<typeof queryKeys.userStats>>,
) {
  return useApiQuery(queryKeys.userStats(), getUserStats, options)
}
