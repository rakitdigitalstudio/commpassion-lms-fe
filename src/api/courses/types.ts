/** A catalog entry as /explore shows it. `courseId` is Strapi's documentId. */
export interface Course {
  courseId: string
  title: string
  instructorName: string
  imageSrc?: string
  /** IDR */
  price: number
}

/** What /explore asks the catalog for. `search` matches title or instructor. */
export interface CourseListParams {
  search: string
  /** 1-based. */
  page: number
  pageSize: number
}

/** Response from POST /api/v1/checkout (SDS §6 — PROVISIONAL, no spec yet; Ticket #68). */
export interface CheckoutResponse {
  snapToken: string
}

export interface CourseDetail {
  courseId: string
  title: string
  instructorName: string
  imageSrc?: string
  /** IDR */
  price: number
  enrolled: boolean
}

/** Strapi `shared.lesson` component — `video_url` is stripped for public callers. */
export interface StrapiLesson {
  lesson_key: string
  title: string | null
  subtitle: string | null
  /** Seconds. */
  duration: number | null
}

/** Strapi v5 (flattened) course shape — only the fields we read. */
export interface StrapiCourse {
  documentId: string
  title: string
  price: number | null
  coverImage: { url: string } | null
  instructor: { name: string } | null
  /** Only present when populated (getCourseLessons). */
  lessons?: StrapiLesson[]
}
