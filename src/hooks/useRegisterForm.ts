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
        ? 'An account with this email already exists.'
        : 'Something went wrong. Please try again.',
  )

  function submit() {
    if (!fullName.trim()) {
      setValidationError('Please enter your full name.')
      return
    }
    if (!isPasswordValid(password)) {
      setValidationError('Password does not meet the requirements below.')
      return
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.')
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
