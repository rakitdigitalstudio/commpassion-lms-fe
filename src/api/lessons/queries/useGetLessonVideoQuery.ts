import { queryKeys } from '@/api/core/query-keys'
import { useApiQuery, type ApiQueryOptions } from '@/api/core/useApiQuery'
import { getLessonVideoUrl } from '@/api/lessons/service/lessons'

/** The selected lesson's video URL — fetched per lesson, enrolled learners only. */
export function useGetLessonVideoQuery(
  courseId: string,
  index: number,
  options?: ApiQueryOptions<string, ReturnType<typeof queryKeys.lessonVideo>>,
) {
  return useApiQuery(
    queryKeys.lessonVideo(courseId, index),
    () => getLessonVideoUrl(courseId, index),
    options,
  )
}
