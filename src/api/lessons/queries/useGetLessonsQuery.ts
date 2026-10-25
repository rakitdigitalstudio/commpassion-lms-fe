import { queryKeys } from '@/api/core/query-keys'
import { useApiQuery, type ApiQueryOptions } from '@/api/core/useApiQuery'
import { getLessons } from '@/api/lessons/service/lessons'
import type { Lesson } from '@/api/lessons/types'

export function useGetLessonsQuery(
  courseId: string,
  options?: ApiQueryOptions<Lesson[], ReturnType<typeof queryKeys.lessons>>,
) {
  return useApiQuery(queryKeys.lessons(courseId), () => getLessons(courseId), options)
}
