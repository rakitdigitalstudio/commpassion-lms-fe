import type { SubmitEvent } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { MailIcon } from '@/components/icons'
import { Logo } from '@/components/Logo'
import { useForgotPasswordForm } from '@/hooks/useForgotPasswordForm'

/**
 * No Figma frame exists for this page yet (Ticket #11 flags this — "Flag
 * missing design to Irene/Marco Herbert"). Layout reuses the Login page's
 * single-column form style as a placeholder pending real design.
 */
export function ForgotPassword() {
  const { email, setEmail, isSubmitting, isSubmitted, submit } = useForgotPasswordForm()

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    void submit()
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Logo className="h-16 w-auto" />
        <h1 className="text-display mt-6 font-bold">Forgot your password?</h1>
        <p className="text-muted mt-2">
          Enter your email and we&apos;ll send you a link to reset it.
        </p>

        {isSubmitted ? (
          <p className="border-border mt-8 rounded-card border p-4 text-sm">
            If an account exists for that email, we&apos;ve sent instructions to reset your
            password.
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
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

            <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <p className="mt-5 text-center text-sm">
          <Link to="/login" className="text-primary font-medium">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
