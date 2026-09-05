import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/Button'
import { EyeIcon, EyeOffIcon, LockIcon, LogoIcon, MailIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import { InvalidCredentialsError } from '@/lib/api/auth'

interface PromoStatProps {
  value: string
  label: string
}

function PromoStat({ value, label }: PromoStatProps) {
  return (
    <div>
      <p className="text-h2 font-bold">{value}</p>
      <p className="text-sm opacity-90">{label}</p>
    </div>
  )
}

/**
 * Promo panel (right side) is hardcoded per the mockup. Ticket #9 flags
 * this exact question — "confirm with Irene whether this is hardcoded or
 * should eventually come from Strapi site_config" — unresolved, see
 * TODO.md. The featured-course image is a plain color placeholder; no
 * real asset/pipeline for it exists yet.
 */
function PromoPanel() {
  return (
    <div className="hidden items-center p-8 lg:flex">
      <div className="w-full rounded-card bg-primary p-10 text-white">
        <h2 className="text-display font-bold">
          Communicate to <span className="font-black">Influence</span>.
          <br />
          Lead to <span className="font-black">Inspire</span>.
        </h2>
        <p className="mt-4 max-w-md opacity-90">
          Join thousands of learners transforming how they connect, communicate, and lead.
        </p>

        <div className="mt-8 flex gap-8">
          <PromoStat value="5000+" label="Voices Empowered" />
          <PromoStat value="150+" label="Learning Experiences" />
          <PromoStat value="50+" label="Trusted Partnerships" />
        </div>

        <div className="mt-8 overflow-hidden rounded-card">
          <div className="relative h-56 bg-slate-800">
            <span className="bg-accent text-foreground absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold">
              Featured Course
            </span>
          </div>
          <div className="bg-primary p-4">
            <p className="font-semibold">How to Be A Great MC</p>
            <p className="text-sm opacity-90">By Indra Herlambang • 12 Video Modules</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full bg-white/30">
                <div className="h-full w-1/5 rounded-full bg-white" />
              </div>
              <span className="text-xs opacity-90">20%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isComingSoon = import.meta.env.VITE_IS_COMING_SOON === 'true'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login({ email, password })
      navigate('/dashboard', { replace: true })
    } catch (submitError) {
      setError(
        submitError instanceof InvalidCredentialsError
          ? 'Invalid email or password. Please try again.'
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <LogoIcon className="text-primary h-12 w-12" />
          <h1 className="text-display mt-6 font-bold">Sign in to your account</h1>
          <p className="text-muted mt-2">Enter your email address and password to sign in.</p>

          {isComingSoon ? (
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
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Input Your Password"
                    className="border-border placeholder:text-muted focus:ring-primary/40 w-full rounded-control border py-2 pr-9 pl-9 text-sm focus:ring-2 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="text-muted absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    {showPassword ? (
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

      <PromoPanel />
    </div>
  )
}
