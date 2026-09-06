import type { SubmitEvent } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { EyeIcon, EyeOffIcon, LockIcon } from '@/components/icons'
import { Logo } from '@/components/Logo'
import { useResetPasswordForm } from '@/hooks/useResetPasswordForm'
import { passwordRules } from '@/lib/password-rules'

/**
 * No Figma frame exists for this page yet (Ticket #11 flags this — "Flag
 * missing design to Irene/Marco Herbert"). Layout reuses the Login page's
 * single-column form style as a placeholder pending real design. The
 * password rules list matches Settings > Security's mockup, the one
 * concrete source we have for them.
 */
export function ResetPassword() {
  const {
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
    hasToken,
  } = useResetPasswordForm()

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    submit()
  }

  const formError = validationError ?? error

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Logo className="h-16 w-auto" />
        <h1 className="text-display mt-6 font-bold">Reset your password</h1>

        {!hasToken ? (
          <p role="alert" className="bg-warning/10 text-warning mt-8 rounded-control p-3 text-sm">
            This reset link is missing or invalid. Please request a new one.
          </p>
        ) : isSuccess ? (
          <div className="mt-8 space-y-4">
            <p className="border-border rounded-card border p-4 text-sm">
              Your password has been reset. You can now sign in with your new password.
            </p>
            <Link to="/login">
              <Button variant="primary" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {formError ? (
              <p role="alert" className="bg-warning/10 text-warning rounded-control p-3 text-sm">
                {formError}
              </p>
            ) : null}

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">
                New Password
              </label>
              <div className="relative">
                <LockIcon className="text-muted pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <input
                  id="password"
                  type={passwordVisibility.inputType}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Input Your New Password"
                  className="border-border placeholder:text-muted focus:ring-primary/40 w-full rounded-control border py-2 pr-9 pl-9 text-sm focus:ring-2 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={passwordVisibility.toggle}
                  aria-label={passwordVisibility.isVisible ? 'Hide password' : 'Show password'}
                  className="text-muted absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {passwordVisibility.isVisible ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              <ul className="mt-2 space-y-1">
                {passwordRules.map((rule) => {
                  const isMet = rule.test(password)
                  return (
                    <li
                      key={rule.id}
                      className={`text-xs ${isMet ? 'text-success' : 'text-muted'}`}
                    >
                      {isMet ? '✓' : '•'} {rule.label}
                    </li>
                  )
                })}
              </ul>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <LockIcon className="text-muted pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <input
                  id="confirmPassword"
                  type={confirmPasswordVisibility.inputType}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm Your New Password"
                  className="border-border placeholder:text-muted focus:ring-primary/40 w-full rounded-control border py-2 pr-9 pl-9 text-sm focus:ring-2 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={confirmPasswordVisibility.toggle}
                  aria-label={
                    confirmPasswordVisibility.isVisible ? 'Hide password' : 'Show password'
                  }
                  className="text-muted absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {confirmPasswordVisibility.isVisible ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Resetting…' : 'Reset Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
