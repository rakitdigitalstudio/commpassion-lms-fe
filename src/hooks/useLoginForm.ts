import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useUserAuthenticationContext } from '@/context/UserAuthenticationContext'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility'
import { InvalidCredentialsError } from '@/api/auth/service/auth'
import type { AuthLocationState } from '@/lib/auth-location-state'

/**
 * All of the Login page's form state + submit logic, extracted out of the
 * component so Login.tsx stays presentational (JSX + wiring these values
 * to inputs). See README "Forms" for the convention this follows.
 */
export function useLoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useUserAuthenticationContext()
  const password = usePasswordVisibility()

  const locationState = location.state as AuthLocationState | null
  const showRegisteredNotice = locationState?.justRegistered === true
  const returnTo = locationState?.returnTo

  const [email, setEmail] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // `error` holds an i18n key (translated by the page via t(error)), not
  // display text — see README "Forms" / "Internationalization".
  const {
    run: submit,
    isSubmitting,
    error,
  } = useAsyncAction(
    async () => {
      await login({ email, password: passwordValue })
      navigate(returnTo ?? '/dashboard', { replace: true })
    },
    (submitError) =>
      submitError instanceof InvalidCredentialsError
        ? 'auth.login.errorInvalidCredentials'
        : 'auth.login.errorGeneric',
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
    showRegisteredNotice,
    returnTo,
  } as const
}
