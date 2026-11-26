import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useResetPasswordMutation } from '@/api/auth/mutations/useResetPasswordMutation'
import {
  ApiValidationError,
  InvalidResetTokenError,
  RateLimitedError,
} from '@/api/auth/service/auth'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility'
import { isPasswordValid } from '@/lib/password-rules'

/**
 * Backs the emailed reset link, mounted at `/change-password?t=<token>`
 * (see ChangePassword.tsx). The query param is `t`, but the API's body
 * field is still `token` — see resetPassword() in service/auth.ts.
 *
 * `formError` is fully-resolved display text rather than an i18n key like
 * useLoginForm/useRegisterForm return — a `validation_error` carries the
 * API's own message verbatim (per the handoff, shown as-is, not
 * translated), so this hook resolves everything itself instead of
 * leaving half the cases for the page to translate.
 */
export function useResetPasswordForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('t')

  // Strip the token from the address bar once it's been read, so it
  // doesn't linger in browser history / get shared via a copied URL.
  useEffect(() => {
    if (token) {
      history.replaceState(null, '', '/change-password')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(null)
  const [isExpiredToken, setIsExpiredToken] = useState(false)

  const passwordVisibility = usePasswordVisibility()
  const confirmPasswordVisibility = usePasswordVisibility()
  const { mutateAsync: handleResetPassword } = useResetPasswordMutation()

  const {
    run: submitReset,
    isSubmitting,
    error: mutationError,
  } = useAsyncAction(
    async () => {
      if (!token) {
        throw new InvalidResetTokenError('Missing reset token')
      }
      await handleResetPassword({ token, password })
      toast.success(t('auth.resetPassword.successMessage'))
      navigate('/login', { replace: true })
    },
    (submitError) => {
      if (submitError instanceof InvalidResetTokenError) {
        setIsExpiredToken(true)
        return t('auth.resetPassword.errorExpiredToken')
      }
      if (submitError instanceof ApiValidationError) {
        return submitError.message
      }
      if (submitError instanceof RateLimitedError) {
        setRetryAfterSeconds(submitError.retryAfterSeconds)
        return t('common.errors.rateLimited', { seconds: submitError.retryAfterSeconds })
      }
      return t('auth.resetPassword.errorGeneric')
    },
  )

  function submit() {
    setRetryAfterSeconds(null)
    setIsExpiredToken(false)
    if (!isPasswordValid(password)) {
      setValidationError(t('auth.resetPassword.errorPasswordRules'))
      return
    }
    if (password !== confirmPassword) {
      setValidationError(t('auth.resetPassword.errorPasswordMismatch'))
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
    formError: validationError ?? mutationError,
    isSubmitting,
    retryAfterSeconds,
    isExpiredToken,
    submit,
    hasToken: Boolean(token),
  } as const
}
