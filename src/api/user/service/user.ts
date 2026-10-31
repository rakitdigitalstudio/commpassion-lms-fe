import { API_ENDPOINTS, HTTP_METHOD } from '@/api/core/endpoints'
import { apiUrl, ApiError, getApiData, getCsrfToken, readErrorCode } from '@/api/core/http'
import { getCoursesByIds } from '@/api/courses/service/courses'
import type { Course } from '@/api/courses/types'
import type {
  CourseProgress,
  CourseProgressResponse,
  CourseProgressStatus,
  UserActivity,
  UserActivityResponse,
  UserCourse,
  UserCourseResponse,
  UserStats,
  UserStatsResponse,
} from '@/api/user/types'

/**
 * Learner data from the Golang API (/api/v1/user/*), mapped from its
 * snake_case wire shapes into the types pages use.
 */

export function toCourseProgress(progress: CourseProgressResponse): CourseProgress {
  return {
    completedCount: progress.completed_count,
    totalCount: progress.total_count,
    isFinished: progress.is_finished,
    finishedLessonKeys: progress.lessons
      .filter((lesson) => lesson.is_lesson_finished)
      .map((lesson) => lesson.lesson_key),
  }
}

export async function getCourseProgress(courseId: string): Promise<CourseProgress> {
  return toCourseProgress(
    await getApiData<CourseProgressResponse>(API_ENDPOINTS.user.courseProgress(courseId)),
  )
}

function toStatus(enrollment: UserCourseResponse, progress: CourseProgress | null): CourseProgressStatus {
  if (enrollment.status === 'completed' || progress?.isFinished) return 'completed'
  if (progress && progress.completedCount > 0) return 'in-progress'
  return 'not-started'
}

/**
 * The learner's enrolled courses. The API only returns id/title/status, so
 * each row is decorated with its catalog entry (one Strapi request) and its
 * progress (one request per course). Either lookup failing degrades that
 * row (no cover/instructor, or 0 progress) instead of failing the list —
 * the same way the API itself degrades titles when its catalog is down.
 */
export async function getUserCourses(): Promise<UserCourse[]> {
  const enrollments = await getApiData<UserCourseResponse[]>(API_ENDPOINTS.user.courses)
  const courseIds = enrollments.map((enrollment) => enrollment.course_id)

  const [catalog, progresses] = await Promise.all([
    getCoursesByIds(courseIds).catch(() => new Map<string, Course>()),
    Promise.all(courseIds.map((courseId) => getCourseProgress(courseId).catch(() => null))),
  ])

  return enrollments.map((enrollment, index) => {
    const course = catalog.get(enrollment.course_id)
    const progress = progresses[index]
    const completedLessons = progress?.completedCount ?? 0
    const totalLessons = progress?.totalCount ?? 0

    return {
      courseId: enrollment.course_id,
      title: enrollment.title || course?.title || enrollment.course_id,
      instructorName: course?.instructorName ?? '',
      imageSrc: course?.imageSrc,
      status: toStatus(enrollment, progress),
      completedLessons,
      totalLessons,
      progress: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
    }
  })
}

export async function getUserStats(): Promise<UserStats> {
  const stats = await getApiData<UserStatsResponse>(API_ENDPOINTS.user.stats)

  return {
    coursesEnrolled: stats.courses_enrolled,
    certificatesCount: stats.certificates_count,
    certificatesInReview: stats.certificates_in_review,
  }
}

export async function getUserActivities(): Promise<UserActivity[]> {
  return getApiData<UserActivityResponse[]>(API_ENDPOINTS.user.activities)
}

/**
 * Dismisses the post-login introduction video — flips is_new_user false
 * server-side. Idempotent on the backend, so no special handling here for
 * calling it twice.
 */
export async function completeOnboarding(): Promise<void> {
  const csrfToken = await getCsrfToken()

  const res = await fetch(apiUrl(API_ENDPOINTS.user.onboardingComplete), {
    method: HTTP_METHOD.POST,
    credentials: 'include',
    headers: { 'X-CSRF-Token': csrfToken },
  })

  if (!res.ok) {
    throw new ApiError(res.status, await readErrorCode(res))
  }
}
