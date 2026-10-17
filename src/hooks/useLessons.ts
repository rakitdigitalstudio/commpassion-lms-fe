import { getLessons, markLessonComplete } from '@/lib/api/lessons'
import { useApiMutation } from '@/api/core/useApiMutation'
import { useApiQuery } from '@/api/core/useApiQuery'
import { queryKeys } from '@/api/core/query-keys'

export function useLessons(courseId: string) {
  return useApiQuery(queryKeys.lessons(courseId), () => getLessons(courseId))
}

export function useMarkLessonComplete(courseId: string) {
  return useApiMutation((lessonId: string) => markLessonComplete(courseId, lessonId), {
    invalidateKeys: [queryKeys.lessons(courseId)],
  })
}
