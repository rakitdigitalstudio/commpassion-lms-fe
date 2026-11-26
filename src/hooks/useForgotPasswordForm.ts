import { useState } from 'react'

import { useForgotPasswordMutation } from '@/api/auth/mutations/useForgotPasswordMutation'
import { RateLimitedError } from '@/api/auth/service/auth'

/**
 * Ends in the same "submitted" state regardless of whether the account
 * actually exists — per Ticket #11's acceptance criteria, the form must
 * never reveal that. The one exception is a genuine rate limit: that's
 * not account-existence information, so it's shown instead of swallowed.
 */
export function useForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(null)
  const { mutate: handleForgotPassword, isPending: isSubmitting } = useForgotPasswordMutation()

  function submit() {
    setRetryAfterSeconds(null)
    handleForgotPassword(
      { email },
      {
        onError: (mutationError) => {
          if (mutationError instanceof RateLimitedError) {
            setRetryAfterSeconds(mutationError.retryAfterSeconds)
          } else {
            setIsSubmitted(true)
          }
        },
        onSuccess: () => setIsSubmitted(true),
      },
    )
  }

  return { email, setEmail, isSubmitting, isSubmitted, retryAfterSeconds, submit } as const
}
