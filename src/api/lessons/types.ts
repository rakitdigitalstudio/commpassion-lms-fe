/** One lesson of a course, in display order. `id` is Strapi's `lesson_key`. */
export interface Lesson {
  id: string
  /** Position in the course — the Golang lesson endpoint addresses lessons by it. */
  index: number
  title: string
  subtitle?: string
  /** Seconds. */
  durationSeconds?: number
  completed: boolean
}

/** GET /api/v1/courses/:courseId/lessons/:index (enrolled learners only). */
export interface LessonVideoResponse {
  course_id: string
  index: number
  lesson_key: string
  title: string
  video_url: string
  duration: number
}
