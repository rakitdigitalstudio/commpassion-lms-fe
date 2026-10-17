import { getCourses } from '@/api/courses/service/courses'
import type { Course } from '@/api/courses/types'
import { queryKeys } from '@/api/core/query-keys'
import { useApiQuery, type ApiQueryOptions } from '@/api/core/useApiQuery'

/** The public catalog behind /explore — see Explore.tsx. */
export function useGetCoursesQuery(
  options?: ApiQueryOptions<Course[], ReturnType<typeof queryKeys.courseList>>,
) {
  return useApiQuery(queryKeys.courseList(), getCourses, options)
}
