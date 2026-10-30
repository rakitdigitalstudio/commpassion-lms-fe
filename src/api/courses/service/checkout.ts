import type { CheckoutResponse } from '@/api/courses/types'
import { API_ENDPOINTS, HTTP_METHOD } from '@/api/core/endpoints'
import { apiUrl, getCsrfToken, readData } from '@/api/core/http'

/** Thrown by checkout() on a 409 (learner already enrolled in this course). */
export class CourseAlreadyEnrolledError extends Error {}

/** Thrown by checkout() on a 422 (course isn't published / not purchasable). */
export class CourseUnpublishedError extends Error {}

/**
 * Golang checkout client (TODO.md §5 `/api/v1/checkout`) — PROVISIONAL,
 * no SDS §6 shape to build against yet (Ticket #68), so this follows the
 * same `{ course_id }` request / `{ data: { snap_token }, message }`
 * response convention as the rest of the Golang API until confirmed.
 * Intercepted by the MSW handler in src/mocks/handlers.ts when
 * VITE_USE_MOCKS is on.
 */
export async function checkout(courseId: string): Promise<CheckoutResponse> {
  const csrfToken = await getCsrfToken()

  const res = await fetch(apiUrl(API_ENDPOINTS.checkout), {
    method: HTTP_METHOD.POST,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify({ course_id: courseId }),
  })

  if (res.status === 409) {
    throw new CourseAlreadyEnrolledError('Already enrolled in this course')
  }

  if (res.status === 422) {
    throw new CourseUnpublishedError('This course is not available for purchase')
  }

  if (!res.ok) {
    throw new Error(`checkout failed: ${res.status}`)
  }

  const { snap_token: snapToken } = await readData<{ snap_token: string }>(res)

  return { snapToken }
}
