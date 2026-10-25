import type { CourseListParams } from '@/api/courses/types'

/**
 * Every segment a query key is built from. Enum-like for the same reason
 * as HTTP_METHOD (src/api/core/endpoints.ts): tsconfig's
 * `erasableSyntaxOnly` disallows TS `enum`. Segments are reused across
 * branches (e.g. COURSES for both the catalog and the user's courses) —
 * the prefix before them is what keeps keys distinct.
 */
export const QUERY_KEY = {
  API: 'api',
  AUTH: 'auth',
  ME: 'me',
  COURSES: 'courses',
  LIST: 'list',
  LESSONS: 'lessons',
  VIDEO: 'video',
  USER: 'user',
  STATS: 'stats',
  ACTIVITIES: 'activities',
  CERTIFICATES: 'certificates',
  SITE_CONFIG: 'site-config',
} as const

export type QueryKeySegment = (typeof QUERY_KEY)[keyof typeof QUERY_KEY]

/**
 * Central query-key factory. Every useApiQuery call gets its key from here
 * instead of a hand-written array, so invalidation (useApiMutation's `invalidateKeys`,
 * useQueryCache's helpers) can't drift out of sync with the keys queries actually
 * use.
 *
 * Add a branch here per resource as its API client function lands
 * (blocked on SDS §6 — see TODO.md). Keep the nesting shallow: one level
 * per resource, params only on the leaf.
 */
export const queryKeys = {
  all: [QUERY_KEY.API] as const,

  auth: () => [...queryKeys.all, QUERY_KEY.AUTH] as const,
  me: () => [...queryKeys.auth(), QUERY_KEY.ME] as const,

  courses: () => [...queryKeys.all, QUERY_KEY.COURSES] as const,
  courseList: (params?: CourseListParams) =>
    params
      ? ([...queryKeys.courses(), QUERY_KEY.LIST, params] as const)
      : ([...queryKeys.courses(), QUERY_KEY.LIST] as const),
  course: (courseId: string) => [...queryKeys.courses(), courseId] as const,
  lessons: (courseId: string) => [...queryKeys.course(courseId), QUERY_KEY.LESSONS] as const,
  lessonVideo: (courseId: string, index: number) =>
    [...queryKeys.lessons(courseId), QUERY_KEY.VIDEO, index] as const,

  user: () => [...queryKeys.all, QUERY_KEY.USER] as const,
  userCourses: () => [...queryKeys.user(), QUERY_KEY.COURSES] as const,
  userStats: () => [...queryKeys.user(), QUERY_KEY.STATS] as const,
  userActivities: () => [...queryKeys.user(), QUERY_KEY.ACTIVITIES] as const,

  certificates: () => [...queryKeys.all, QUERY_KEY.CERTIFICATES] as const,

  siteConfig: () => [...queryKeys.all, QUERY_KEY.SITE_CONFIG] as const,
}
