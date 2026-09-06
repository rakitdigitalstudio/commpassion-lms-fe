import { useCallback, useState } from 'react'

/**
 * Tracks isSubmitting/error around a single async action, and maps a
 * thrown error to a display message — the bit of every form's submit
 * handler that isn't specific to that form. Page-specific form hooks
 * (useLoginForm, useResetPasswordForm, ...) compose this instead of each
 * hand-rolling their own try/isSubmitting/finally block.
 */
export function useAsyncAction<TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<void>,
  getErrorMessage: (error: unknown) => string = () => 'Something went wrong. Please try again.',
) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(
    async (...args: TArgs) => {
      setError(null)
      setIsSubmitting(true)
      try {
        await action(...args)
      } catch (caughtError) {
        setError(getErrorMessage(caughtError))
      } finally {
        setIsSubmitting(false)
      }
    },
    [action, getErrorMessage],
  )

  return { run, isSubmitting, error, setError } as const
}
