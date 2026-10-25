import { queryKeys } from '@/api/core/query-keys'
import { useApiMutation, type ApiMutationOptions } from '@/api/core/useApiMutation'
import { markLessonComplete } from '@/api/lessons/service/lessons'
import type { CourseProgress } from '@/api/user/types'

/** Variables: the lesson's `lesson_key`. Refreshes the lesson list and every course card's progress. */
export function useMarkLessonCompleteMutation(
  courseId: string,
  options?: ApiMutationOptions<CourseProgress, string>,
) {
  return useApiMutation((lessonKey: string) => markLessonComplete(courseId, lessonKey), {
    invalidateKeys: [queryKeys.lessons(courseId), queryKeys.userCourses()],
    ...options,
  })
}
