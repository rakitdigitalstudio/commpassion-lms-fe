import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAsyncAction } from '@/hooks/useAsyncAction'
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility'
import { useAuth } from '@/hooks/useAuth'
import { InvalidCredentialsError } from '@/lib/api/auth'

/**
 * All of the Login page's form state + submit logic, extracted out of the
 * component so Login.tsx stays presentational (JSX + wiring these values
 * to inputs). See README "Forms" for the convention this follows.
 */
export function useLoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const password = usePasswordVisibility()

  const [email, setEmail] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const {
    run: submit,
    isSubmitting,
    error,
  } = useAsyncAction(
    async () => {
      await login({ email, password: passwordValue })
      navigate('/dashboard', { replace: true })
    },
    (submitError) =>
      submitError instanceof InvalidCredentialsError
        ? 'Invalid email or password. Please try again.'
        : 'Something went wrong. Please try again.',
  )

  return {
    email,
    setEmail,
    password: passwordValue,
    setPassword: setPasswordValue,
    passwordVisibility: password,
    rememberMe,
    setRememberMe,
    error,
    isSubmitting,
    submit,
  } as const
}
