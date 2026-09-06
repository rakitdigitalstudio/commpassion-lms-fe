import type { SubmitEvent } from 'react'
import { Link } from 'react-router-dom'

import { AuthPromoPanel } from '@/components/AuthPromoPanel'
import { Button } from '@/components/Button'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from '@/components/icons'
import { Logo } from '@/components/Logo'
import { useRegisterForm } from '@/hooks/useRegisterForm'
import { passwordRules } from '@/lib/password-rules'

/**
 * No Figma frame exists for this page (Ticket #10 flags this itself —
 * "Flag missing design to Irene/Marco Herbert"). Built with an explicitly
 * approved placeholder layout, reusing Login's two-column style. See
 * TODO.md.
 */
export function Register() {
  const {
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
    error,
    isSubmitting,
    submit,
  } = useRegisterForm()

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    submit()
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <Logo className="h-16 w-auto" />
          <h1 className="text-display mt-6 font-bold">Create your account</h1>
          <p className="text-muted mt-2">Sign up to start learning with CommPassion.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {error ? (
              <p role="alert" className="bg-warning/10 text-warning rounded-control p-3 text-sm">
                {error}
              </p>
            ) : null}

            <div>
              <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Input Your Full Name"
                className="border-border placeholder:text-muted focus:ring-primary/40 w-full rounded-control border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <MailIcon className="text-muted pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Input Your Email Address"
                  className="border-border placeholder:text-muted focus:ring-primary/40 w-full rounded-control border py-2 pr-3 pl-9 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">
                Password
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
                  placeholder="Input Your Password"
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
                  placeholder="Confirm Your Password"
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
              {isSubmitting ? 'Creating account…' : 'Sign Up'}
            </Button>

            <p className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      <AuthPromoPanel />
    </div>
  )
}
