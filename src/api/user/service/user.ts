import type { UserActivity, UserCourse, UserStat } from '@/api/user/types'
import { existingUserStats, recentActivity } from '@/lib/stub-data/dashboard'
import { purchasedCourses } from '@/lib/stub-data/purchases'

/**
 * PROVISIONAL user client — still stub-backed. The real Golang endpoints
 * exist (/api/v1/user/courses, /stats, /activities), but their response
 * shapes don't match these types yet; reconciling that is #30. Only these
 * function bodies change then — hooks and pages stay the same.
 */

const STUB_LATENCY_MS = 150

async function stubLatency() {
  await new Promise((resolve) => setTimeout(resolve, STUB_LATENCY_MS))
}

export async function getUserCourses(): Promise<UserCourse[]> {
  await stubLatency()

  return purchasedCourses
}

export async function getUserStats(): Promise<UserStat[]> {
  await stubLatency()

  return existingUserStats
}

export async function getUserActivities(): Promise<UserActivity[]> {
  await stubLatency()

  return recentActivity
}
