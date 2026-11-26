import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useChangePasswordMutation } from '@/api/auth/mutations/useChangePasswordMutation'
import {
  ApiValidationError,
  InvalidCurrentPasswordError,
  RateLimitedError,
  UnauthenticatedError,
} from '@/api/auth/service/auth'
import { useAppToast } from '@/hooks/useAppToast'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import { isPasswordValid } from '@/lib/password-rules'

/**
 * Backs Settings > Security's "Change Password" panel (Ticket #81). Like
 * useResetPasswordForm, this resolves display text itself (mixing raw
 * `validation_error` messages from the API with translated client-side
 * copy) rather than returning an i18n key for the page to translate.
 */
export function useChangePasswordForm() {
  const { t } = useTranslation()
  const toast = useAppToast()
  const navigate = useNavigate()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null)
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null)
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(null)

  const { mutateAsync: handleChangePassword } = useChangePasswordMutation()

  function resetFieldErrors() {
    setCurrentPasswordError(null)
    setNewPasswordError(null)
    setRetryAfterSeconds(null)
  }

  const { run: submitChange, isSubmitting } = useAsyncAction(
    async () => {
      await handleChangePassword({ currentPassword, newPassword })
      toast.success('settings.security.successMessage')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    },
    (submitError) => {
      if (submitError instanceof UnauthenticatedError) {
        navigate('/login', { replace: true })
        return t('common.errors.generic')
      }
      if (submitError instanceof InvalidCurrentPasswordError) {
        setCurrentPasswordError(t('settings.security.errorCurrentPasswordInvalid'))
        return ''
      }
      if (submitError instanceof ApiValidationError) {
        setNewPasswordError(submitError.message)
        return ''
      }
      if (submitError instanceof RateLimitedError) {
        setRetryAfterSeconds(submitError.retryAfterSeconds)
        return t('common.errors.rateLimited', { seconds: submitError.retryAfterSeconds })
      }
      return t('common.errors.generic')
    },
  )

  function submit() {
    resetFieldErrors()

    if (!isPasswordValid(newPassword)) {
      setNewPasswordError(t('settings.security.errorPasswordRules'))
      return
    }
    if (newPassword !== confirmPassword) {
      setNewPasswordError(t('settings.security.errorPasswordMismatch'))
      return
    }
    void submitChange()
  }

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    currentPasswordError,
    newPasswordError,
    retryAfterSeconds,
    isSubmitting,
    submit,
  } as const
}
