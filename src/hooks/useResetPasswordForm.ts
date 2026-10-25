import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useResetPasswordMutation } from '@/api/auth/mutations/useResetPasswordMutation'
import { InvalidResetTokenError } from '@/api/auth/service/auth'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility'
import { isPasswordValid } from '@/lib/password-rules'

export function useResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const passwordVisibility = usePasswordVisibility()
  const confirmPasswordVisibility = usePasswordVisibility()
  const { mutateAsync: handleResetPassword } = useResetPasswordMutation()

  const {
    run: submitReset,
    isSubmitting,
    error,
  } = useAsyncAction(
    async () => {
      if (!token) {
        throw new InvalidResetTokenError('Missing reset token')
      }
      await handleResetPassword({ token, password })
      setIsSuccess(true)
    },
    (submitError) =>
      submitError instanceof InvalidResetTokenError
        ? 'This reset link is invalid or has expired. Please request a new one.'
        : 'Something went wrong. Please try again.',
  )

  function submit() {
    if (!isPasswordValid(password)) {
      setValidationError('Password does not meet the requirements below.')
      return
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.')
      return
    }
    setValidationError(null)
    void submitReset()
  }

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordVisibility,
    confirmPasswordVisibility,
    validationError,
    error,
    isSubmitting,
    isSuccess,
    submit,
    hasToken: Boolean(token),
  } as const
}
