import type { SubmitEvent } from 'react'
import { Link } from 'react-router-dom'

import { AuthPromoPanel } from '@/components/AuthPromoPanel'
import { Button } from '@/components/Button'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from '@/components/icons'
import { Logo } from '@/components/Logo'
import { useLoginForm } from '@/hooks/useLoginForm'
import { IS_COMING_SOON } from '@/lib/config'

export function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    passwordVisibility,
    rememberMe,
    setRememberMe,
    error,
    isSubmitting,
    submit,
    showRegisteredNotice,
  } = useLoginForm()

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    void submit()
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <Logo className="h-16 w-auto" />
          <h1 className="text-display mt-6 font-bold">Sign in to your account</h1>
          <p className="text-muted mt-2">Enter your email address and password to sign in.</p>

          {showRegisteredNotice ? (
            <p className="bg-success/10 text-success rounded-control mt-6 p-3 text-sm">
              Account created! Please sign in.
            </p>
          ) : null}

          {IS_COMING_SOON ? (
            <div className="border-border mt-8 rounded-card border border-dashed p-6 text-center">
              <p className="font-semibold">Sign-in is coming soon</p>
              <p className="text-muted mt-1 text-sm">
                We&apos;re putting the finishing touches on accounts. Check back soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              {error ? (
                <p role="alert" className="bg-warning/10 text-warning rounded-control p-3 text-sm">
                  {error}
                </p>
              ) : null}

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
                    autoComplete="current-password"
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
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="border-border h-4 w-4 rounded"
                  />
                  Remember Me
                </label>
                <a href="/forgot-password" className="text-primary font-medium">
                  Forgot Password?
                </a>
              </div>

              <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </Button>

              <p className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <a href="/register" className="text-primary font-medium">
                  Sign up
                </a>
              </p>

              <div className="flex items-center gap-3">
                <span className="border-border flex-1 border-t" />
                <span className="text-muted text-xs">or</span>
                <span className="border-border flex-1 border-t" />
              </div>
            </form>
          )}

          <Link to="/explore" className="mt-5 block">
            <Button variant="outline" className="w-full">
              Explore Online Courses
            </Button>
          </Link>
        </div>
      </div>

      <AuthPromoPanel />
    </div>
  )
}
