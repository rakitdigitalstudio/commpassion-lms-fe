/** Where a learner is in a course, as the course cards and badges show it. */
export type CourseProgressStatus = 'not-started' | 'in-progress' | 'completed'

/** An enrolled course, decorated with catalog info (Strapi) and progress. */
export interface UserCourse {
  courseId: string
  title: string
  instructorName: string
  imageSrc?: string
  status: CourseProgressStatus
  completedLessons: number
  totalLessons: number
  /** 0-100 */
  progress: number
}

export interface UserStats {
  coursesEnrolled: number
  certificatesCount: number
  certificatesInReview: number
}

export interface UserActivity {
  id: string
  /** `enrolled` | `purchased` today; unknown types still render. */
  type: string
  description: string
  /** ISO 8601. */
  timestamp: string
}

/** Per-lesson completion for one course (GET /user/courses/:id/progress). */
export interface CourseProgress {
  completedCount: number
  totalCount: number
  isFinished: boolean
  finishedLessonKeys: string[]
}

// --- Golang API wire shapes (internal/delivery/http/handler) ---------------

export interface UserCourseResponse {
  course_id: string
  /** Empty when the API's catalog lookup degraded. */
  title: string
  status: 'active' | 'completed'
}

export interface UserStatsResponse {
  courses_enrolled: number
  certificates_count: number
  certificates_in_review: number
}

export interface UserActivityResponse {
  id: string
  type: string
  description: string
  timestamp: string
}

export interface CourseProgressResponse {
  course_id: string
  is_finished: boolean
  completed_count: number
  total_count: number
  lessons: { lesson_key: string; is_lesson_finished: boolean; completed_at: string | null }[]
}
