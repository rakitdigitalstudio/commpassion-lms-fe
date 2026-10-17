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
  all: ['api'] as const,

  auth: () => [...queryKeys.all, 'auth'] as const,
  me: () => [...queryKeys.auth(), 'me'] as const,

  courses: () => [...queryKeys.all, 'courses'] as const,
  courseList: () => [...queryKeys.courses(), 'list'] as const,
  course: (courseId: string) => [...queryKeys.courses(), courseId] as const,
  lessons: (courseId: string) => [...queryKeys.course(courseId), 'lessons'] as const,

  userCourses: () => [...queryKeys.all, 'user', 'courses'] as const,
  userStats: () => [...queryKeys.all, 'user', 'stats'] as const,
  userActivities: () => [...queryKeys.all, 'user', 'activities'] as const,

  certificates: () => [...queryKeys.all, 'certificates'] as const,

  siteConfig: () => [...queryKeys.all, 'site-config'] as const,
}
