import { API_ENDPOINTS, HTTP_METHOD } from '@/api/core/endpoints'
import {
  ApiError,
  apiUrl,
  getApiData,
  getCsrfToken,
  readData,
  readErrorCode,
} from '@/api/core/http'
import { getCourseLessons } from '@/api/courses/service/courses'
import type { Lesson, LessonVideoResponse } from '@/api/lessons/types'
import { getCourseProgress, toCourseProgress } from '@/api/user/service/user'
import type { CourseProgress, CourseProgressResponse } from '@/api/user/types'

/**
 * Lesson content comes from Strapi (titles, order, duration — public, no
 * video URLs); completion comes from the Golang progress endpoint; the
 * video URL itself only from the Golang lesson endpoint, which checks
 * enrollment.
 */

export async function getLessons(courseId: string): Promise<Lesson[]> {
  const [lessons, progress] = await Promise.all([
    getCourseLessons(courseId),
    getCourseProgress(courseId),
  ])
  const finished = new Set(progress.finishedLessonKeys)

  return lessons.map((lesson, index) => ({
    id: lesson.lesson_key,
    index,
    title: lesson.title ?? '',
    subtitle: lesson.subtitle ?? undefined,
    durationSeconds: lesson.duration ?? undefined,
    completed: finished.has(lesson.lesson_key),
  }))
}

export async function getLessonVideoUrl(courseId: string, index: number): Promise<string> {
  const lesson = await getApiData<LessonVideoResponse>(
    API_ENDPOINTS.courses.lesson(courseId, index),
  )

  return lesson.video_url
}

export async function markLessonComplete(
  courseId: string,
  lessonKey: string,
): Promise<CourseProgress> {
  const csrfToken = await getCsrfToken()

  const res = await fetch(apiUrl(API_ENDPOINTS.user.completeLesson(courseId, lessonKey)), {
    method: HTTP_METHOD.POST,
    credentials: 'include',
    headers: { 'X-CSRF-Token': csrfToken },
  })

  if (!res.ok) {
    throw new ApiError(res.status, await readErrorCode(res))
  }

  return toCourseProgress(await readData<CourseProgressResponse>(res))
}
