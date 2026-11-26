import type { SubmitEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { AuthLayout } from '@/components/AuthLayout'
import { AuthPromoPanel } from '@/components/AuthPromoPanel'
import { Button } from '@/components/Button'
import { EyeIcon, EyeOffIcon, LockIcon } from '@/components/icons'
import { Logo } from '@/components/Logo'
import { useResetPasswordForm } from '@/hooks/useResetPasswordForm'
import { passwordRules } from '@/lib/password-rules'

/**
 * Mounted at `/change-password?t=<token>` — the emailed reset link from
 * the backend handoff (Ticket #81). Named ResetPassword/resetPassword
 * throughout the codebase (file, hook, API type/service) since that's
 * what it does and matches the backend's `/reset-password` endpoint;
 * only the frontend route + query param are `change-password`/`t`.
 *
 * <meta name="referrer" content="no-referrer"> keeps the token out of the
 * Referer header on any outbound request this page makes (Ticket #81) —
 * the token itself is only ever held in this hook's state, never logged,
 * sent to analytics, or persisted to storage.
 */
export function ResetPassword() {
  const { t } = useTranslation()
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordVisibility,
    confirmPasswordVisibility,
    formError,
    isSubmitting,
    isExpiredToken,
    submit,
    hasToken,
  } = useResetPasswordForm()

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    submit()
  }

  return (
    <AuthLayout rightPanel={<AuthPromoPanel />}>
      <meta name="referrer" content="no-referrer" />
      <Logo className="h-16 w-auto" />
      <h1 className="text-display mt-6 font-bold">
        {hasToken ? t('auth.resetPassword.heading') : t('auth.resetPassword.invalidLinkHeading')}
      </h1>

      {!hasToken ? (
        <div className="mt-8 space-y-4">
          <p role="alert" className="bg-warning/10 text-warning rounded-control p-3 text-sm">
            {t('auth.resetPassword.invalidLinkBody')}
          </p>
          <Link to="/forgot-password">
            <Button variant="primary" className="w-full">
              {t('auth.resetPassword.requestNewLink')}
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <p className="text-muted mt-2">{t('auth.resetPassword.subtitle')}</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {formError ? (
              <p role="alert" className="bg-warning/10 text-warning rounded-control p-3 text-sm">
                {formError}
              </p>
            ) : null}

            {isExpiredToken ? (
              <Link to="/forgot-password">
                <Button variant="outline" type="button" className="w-full">
                  {t('auth.resetPassword.requestNewLink')}
                </Button>
              </Link>
            ) : (
              <>
                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium">
                    {t('auth.resetPassword.newPasswordLabel')}
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
                      placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
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
                  <ul className="mt-2 space-y-1">
                    {passwordRules.map((rule) => {
                      const isMet = rule.test(password)
                      return (
                        <li
                          key={rule.id}
                          className={`text-xs ${isMet ? 'text-success' : 'text-muted'}`}
                        >
                          {isMet ? '✓' : '•'} {t(rule.labelKey)}
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
                    {t('auth.resetPassword.confirmPasswordLabel')}
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
                      placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
                      className="border-border placeholder:text-muted focus:ring-primary/40 w-full rounded-control border py-2 pr-9 pl-9 text-sm focus:ring-2 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={confirmPasswordVisibility.toggle}
                      aria-label={t(
                        confirmPasswordVisibility.isVisible
                          ? 'auth.passwordToggle.hide'
                          : 'auth.passwordToggle.show',
                      )}
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

                <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
                  {isSubmitting
                    ? t('auth.resetPassword.submitting')
                    : t('auth.resetPassword.submit')}
                </Button>
              </>
            )}
          </form>
        </>
      )}
    </AuthLayout>
  )
}
