import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAsyncAction } from '@/hooks/useAsyncAction'
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility'
import { EmailAlreadyRegisteredError, register } from '@/lib/api/auth'
import { isPasswordValid } from '@/lib/password-rules'

/**
 * Per your decision: register() does not log the user in — success
 * redirects to /login with a "justRegistered" notice, and the user signs
 * in separately.
 */
export function useRegisterForm() {
  const navigate = useNavigate()
  const passwordVisibility = usePasswordVisibility()
  const confirmPasswordVisibility = usePasswordVisibility()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  // Both validationError and the async error hold i18n keys (translated
  // by the page via t(error)), not display text — see README "Forms" /
  // "Internationalization".
  const {
    run: submitRegister,
    isSubmitting,
    error,
  } = useAsyncAction(
    async () => {
      await register({ fullName, email, password })
      navigate('/login', { replace: true, state: { justRegistered: true } })
    },
    (submitError) =>
      submitError instanceof EmailAlreadyRegisteredError
        ? 'auth.register.errorEmailTaken'
        : 'auth.register.errorGeneric',
  )

  function submit() {
    if (!fullName.trim()) {
      setValidationError('auth.register.errorFullNameRequired')
      return
    }
    if (!isPasswordValid(password)) {
      setValidationError('auth.register.errorPasswordRules')
      return
    }
    if (password !== confirmPassword) {
      setValidationError('auth.register.errorPasswordMismatch')
      return
    }
    setValidationError(null)
    void submitRegister()
  }

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordVisibility,
    confirmPasswordVisibility,
    error: validationError ?? error,
    isSubmitting,
    submit,
  } as const
}
