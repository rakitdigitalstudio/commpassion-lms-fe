import { useState } from 'react'

import { useForgotPasswordMutation } from '@/api/auth/mutations/useForgotPasswordMutation'

/**
 * Always ends in the same "submitted" state regardless of whether the
 * mock call actually succeeds — per Ticket #11's acceptance criteria,
 * the form must never reveal whether an email exists.
 */
export function useForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { mutate: handleForgotPassword, isPending: isSubmitting } = useForgotPasswordMutation()

  function submit() {
    // onSettled, not onSuccess — an error is intentionally treated the
    // same as success, see the note above.
    handleForgotPassword({ email }, { onSettled: () => setIsSubmitted(true) })
  }

  return { email, setEmail, isSubmitting, isSubmitted, submit } as const
}
