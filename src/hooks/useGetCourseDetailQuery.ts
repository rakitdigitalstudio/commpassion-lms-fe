import { getCourseDetail } from '@/api/courses/service/courses'
import { useApiQuery } from '@/api/core/useApiQuery'
import { queryKeys } from '@/api/core/query-keys'

/** Drives the /courses/:courseId enrollment gate — see CourseDetail.tsx. */
export function useGetCourseDetailQuery(courseId: string) {
  return useApiQuery(queryKeys.course(courseId), () => getCourseDetail(courseId), {
    // CourseDetail.tsx renders its own not-found state.
    suppressErrorToast: true,
  })
}
