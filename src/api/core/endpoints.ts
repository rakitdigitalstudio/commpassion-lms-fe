/**
 * Every Golang API path, in one place. Paths only — no base URL — so the
 * MSW handlers (src/mocks/handlers.ts) can match them with a `*` prefix
 * and services build the full URL via apiUrl() (src/api/core/http.ts).
 *
 * Add a branch per backend route group as its service lands.
 */
export const API_ENDPOINTS = {
  auth: {
    csrf: '/api/v1/auth/csrf',
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    me: '/api/v1/auth/me',
    logout: '/api/v1/auth/logout',
    forgotPassword: '/api/v1/auth/forgot-password',
    resetPassword: '/api/v1/auth/reset-password',
  },
  user: {
    courses: '/api/v1/user/courses',
    stats: '/api/v1/user/stats',
    activities: '/api/v1/user/activities',
    courseProgress: (courseId: string) =>
      `/api/v1/user/courses/${encodeURIComponent(courseId)}/progress`,
    completeLesson: (courseId: string, lessonKey: string) =>
      `/api/v1/user/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonKey)}/complete`,
    /** Toggles is_new_user either direction — body is `{ is_new_user: boolean }`. */
    onboardingPreferences: '/api/v1/user/onboarding/preferences',
  },
  courses: {
    /** Enrolled-only: the one place a lesson's video URL is served. */
    lesson: (courseId: string, index: number) =>
      `/api/v1/courses/${encodeURIComponent(courseId)}/lessons/${index}`,
  },
  /** Issues a Midtrans Snap token for a course purchase (TODO.md §5, Ticket #68). */
  checkout: '/api/v1/checkout',
} as const

/** Strapi (commpassion-backoffice) content API paths — see strapiUrl(). */
export const STRAPI_ENDPOINTS = {
  siteConfig: '/api/site-config',
  courses: '/api/courses',
  course: (courseId: string) => `/api/courses/${encodeURIComponent(courseId)}`,
} as const

/**
 * Enum-like on purpose: tsconfig's `erasableSyntaxOnly` disallows TS
 * `enum`, so this is a const object + matching union type instead.
 */
export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const

export type HttpMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD]
