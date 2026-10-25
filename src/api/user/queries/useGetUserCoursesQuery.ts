import { queryKeys } from '@/api/core/query-keys'
import { useApiQuery, type ApiQueryOptions } from '@/api/core/useApiQuery'
import { getUserCourses } from '@/api/user/service/user'
import type { UserCourse } from '@/api/user/types'

export function useGetUserCoursesQuery(
  options?: ApiQueryOptions<UserCourse[], ReturnType<typeof queryKeys.userCourses>>,
) {
  return useApiQuery(queryKeys.userCourses(), getUserCourses, options)
}
