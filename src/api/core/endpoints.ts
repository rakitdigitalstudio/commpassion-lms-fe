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
} as const

/** Strapi (commpassion-backoffice) content API paths — see strapiUrl(). */
export const STRAPI_ENDPOINTS = {
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
