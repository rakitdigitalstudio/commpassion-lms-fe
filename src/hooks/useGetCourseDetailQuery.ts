import { getCourseDetail } from '@/lib/api/courses'
import { useApiQuery } from '@/hooks/useApiQuery'
import { queryKeys } from '@/lib/query-keys'

/** Drives the /courses/:courseId enrollment gate — see CourseDetail.tsx. */
export function useGetCourseDetailQuery(courseId: string) {
  return useApiQuery(queryKeys.course(courseId), () => getCourseDetail(courseId))
}
