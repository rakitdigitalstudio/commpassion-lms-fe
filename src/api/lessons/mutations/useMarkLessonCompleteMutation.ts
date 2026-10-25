import { queryKeys } from '@/api/core/query-keys'
import { useApiMutation, type ApiMutationOptions } from '@/api/core/useApiMutation'
import { markLessonComplete } from '@/api/lessons/service/lessons'
import type { Lesson } from '@/api/lessons/types'

export function useMarkLessonCompleteMutation(
  courseId: string,
  options?: ApiMutationOptions<Lesson[], string>,
) {
  return useApiMutation((lessonId: string) => markLessonComplete(courseId, lessonId), {
    invalidateKeys: [queryKeys.lessons(courseId)],
    ...options,
  })
}
