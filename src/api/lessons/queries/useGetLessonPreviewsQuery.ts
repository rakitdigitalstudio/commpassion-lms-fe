import { queryKeys } from '@/api/core/query-keys'
import { useApiQuery, type ApiQueryOptions } from '@/api/core/useApiQuery'
import { getLessonPreviews } from '@/api/lessons/service/lessons'
import type { Lesson } from '@/api/lessons/types'

/** Drives CourseDetail.tsx's locked lesson list for non-enrolled visitors. */
export function useGetLessonPreviewsQuery(
  courseId: string,
  options?: ApiQueryOptions<Lesson[], ReturnType<typeof queryKeys.lessonPreviews>>,
) {
  return useApiQuery(queryKeys.lessonPreviews(courseId), () => getLessonPreviews(courseId), options)
}
