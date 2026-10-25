import { getCourseDetail } from '@/api/courses/service/courses'
import type { CourseDetail } from '@/api/courses/types'
import { queryKeys } from '@/api/core/query-keys'
import { useApiQuery, type ApiQueryOptions } from '@/api/core/useApiQuery'

/** Drives the /courses/:courseId enrollment gate — see CourseDetail.tsx. */
export function useGetCourseDetailQuery(
  courseId: string,
  options?: ApiQueryOptions<CourseDetail, ReturnType<typeof queryKeys.course>>,
) {
  return useApiQuery(queryKeys.course(courseId), () => getCourseDetail(courseId), {
    // CourseDetail.tsx renders its own not-found state.
    suppressErrorToast: true,
    ...options,
  })
}
