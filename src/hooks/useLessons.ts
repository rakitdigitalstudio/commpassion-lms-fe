import { getLessons, markLessonComplete } from '@/lib/api/lessons'
import { useApiMutation } from '@/hooks/useApiMutation'
import { useApiQuery } from '@/hooks/useApiQuery'
import { queryKeys } from '@/lib/query-keys'

export function useLessons(courseId: string) {
  return useApiQuery(queryKeys.lessons(courseId), () => getLessons(courseId))
}

export function useMarkLessonComplete(courseId: string) {
  return useApiMutation((lessonId: string) => markLessonComplete(courseId, lessonId), {
    invalidateKeys: [queryKeys.lessons(courseId)],
  })
}
