import type { SubmitEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { AuthLayout } from '@/components/AuthLayout'
import { AuthPromoPanel } from '@/components/AuthPromoPanel'
import { Button } from '@/components/Button'
import { ComingSoonNotice } from '@/components/ComingSoonNotice'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from '@/components/icons'
import { Logo } from '@/components/Logo'
import { useLoginForm } from '@/hooks/useLoginForm'
import { IS_COMING_SOON } from '@/lib/config'

export function Login() {
  const { t } = useTranslation()
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
    <AuthLayout rightPanel={<AuthPromoPanel />}>
      <Logo className="h-16 w-auto" />
      <h1 className="text-display mt-6 font-bold">{t('auth.login.heading')}</h1>
      <p className="text-muted mt-2">{t('auth.login.subtitle')}</p>

      {showRegisteredNotice ? (
        <p className="bg-success/10 text-success rounded-control mt-6 p-3 text-sm">
          {t('auth.login.registeredNotice')}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        {IS_COMING_SOON ? (
          <ComingSoonNotice />
        ) : error ? (
          <p role="alert" className="bg-warning/10 text-warning rounded-control p-3 text-sm">
            {t(error)}
          </p>
        ) : null}

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            {t('auth.login.emailLabel')}
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
              placeholder={t('auth.login.emailPlaceholder')}
              className="border-border placeholder:text-muted focus:ring-primary/40 w-full rounded-control border py-2 pr-3 pl-9 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            {t('auth.login.passwordLabel')}
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
              placeholder={t('auth.login.passwordPlaceholder')}
              className="border-border placeholder:text-muted focus:ring-primary/40 w-full rounded-control border py-2 pr-9 pl-9 text-sm focus:ring-2 focus:outline-none"
            />
            <button
              type="button"
              onClick={passwordVisibility.toggle}
              aria-label={t(
                passwordVisibility.isVisible
                  ? 'auth.passwordToggle.hide'
                  : 'auth.passwordToggle.show',
              )}
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
            {t('auth.login.rememberMe')}
          </label>
          <Link to="/forgot-password" className="text-primary font-medium">
            {t('auth.login.forgotPassword')}
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isSubmitting || IS_COMING_SOON}
        >
          {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
        </Button>

        <p className="text-center text-sm">
          {t('auth.login.noAccount')}{' '}
          <Link to="/register" className="text-primary font-medium">
            {t('auth.login.signUp')}
          </Link>
        </p>

        <div className="flex items-center gap-3">
          <span className="border-border flex-1 border-t" />
          <span className="text-muted text-xs">{t('auth.login.or')}</span>
          <span className="border-border flex-1 border-t" />
        </div>
      </form>

      <Link to="/explore" className="mt-5 block">
        <Button variant="outline" className="w-full">
          {t('auth.login.exploreCourses')}
        </Button>
      </Link>
    </AuthLayout>
  )
}
