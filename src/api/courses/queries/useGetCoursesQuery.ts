import { getCourses } from '@/api/courses/service/courses'
import type { Course, CourseListParams } from '@/api/courses/types'
import type { Page } from '@/api/core/pagination'
import { queryKeys } from '@/api/core/query-keys'
import { useApiQuery, type ApiQueryOptions } from '@/api/core/useApiQuery'

/**
 * One page of the public catalog behind /explore — see Explore.tsx. Keeps
 * the previous page on screen while the next page or search loads.
 */
export function useGetCoursesQuery(
  params: CourseListParams,
  options?: ApiQueryOptions<Page<Course>, ReturnType<typeof queryKeys.courseList>>,
) {
  return useApiQuery(queryKeys.courseList(params), () => getCourses(params), {
    keepPreviousData: true,
    ...options,
  })
}
