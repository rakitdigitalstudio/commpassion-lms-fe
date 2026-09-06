import { useState } from 'react'

import { forgotPassword } from '@/lib/api/auth'

/**
 * Always ends in the same "submitted" state regardless of whether the
 * mock call actually succeeds — per Ticket #11's acceptance criteria,
 * the form must never reveal whether an email exists.
 */
export function useForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function submit() {
    setIsSubmitting(true)
    try {
      await forgotPassword({ email })
    } catch {
      // Intentionally ignored — see the note above.
    } finally {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  return { email, setEmail, isSubmitting, isSubmitted, submit } as const
}
