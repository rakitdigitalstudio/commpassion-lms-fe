import { checkout } from '@/api/courses/service/checkout'
import type { CheckoutResponse } from '@/api/courses/types'
import { useApiMutation, type ApiMutationOptions } from '@/api/core/useApiMutation'

/** Issues a Midtrans Snap token for a course purchase. CourseDetail.tsx shows its own errors. */
export function useCheckoutMutation(options?: ApiMutationOptions<CheckoutResponse, string>) {
  return useApiMutation(checkout, { suppressErrorToast: true, ...options })
}
