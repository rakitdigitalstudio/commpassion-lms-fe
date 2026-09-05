/**
 * Central query-key factory. Every useApiQuery call gets its key from here
 * instead of a hand-written array, so invalidation (see useApiMutation's
 * `invalidateKeys`) can't drift out of sync with the keys queries actually
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
  course: (slug: string) => [...queryKeys.courses(), slug] as const,

  userCourses: () => [...queryKeys.all, 'user', 'courses'] as const,
  userStats: () => [...queryKeys.all, 'user', 'stats'] as const,
  userActivities: () => [...queryKeys.all, 'user', 'activities'] as const,

  certificates: () => [...queryKeys.all, 'certificates'] as const,
}
