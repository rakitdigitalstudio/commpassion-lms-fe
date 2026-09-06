import type { SubmitEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { AuthLayout } from '@/components/AuthLayout'
import { AuthPromoPanel } from '@/components/AuthPromoPanel'
import { Button } from '@/components/Button'
import { ComingSoonNotice } from '@/components/ComingSoonNotice'
import { MailIcon } from '@/components/icons'
import { Logo } from '@/components/Logo'
import { useForgotPasswordForm } from '@/hooks/useForgotPasswordForm'
import { IS_COMING_SOON } from '@/lib/config'

/**
 * No Figma frame exists for this page yet (Ticket #11 flags this — "Flag
 * missing design to Irene/Marco Herbert"). Uses the shared AuthLayout
 * (Ticket #41) as a placeholder pending real design.
 */
export function ForgotPassword() {
  const { t } = useTranslation()
  const { email, setEmail, isSubmitting, isSubmitted, submit } = useForgotPasswordForm()

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    void submit()
  }

  return (
    <AuthLayout rightPanel={<AuthPromoPanel />}>
      <Logo className="h-16 w-auto" />
      <h1 className="text-display mt-6 font-bold">{t('auth.forgotPassword.heading')}</h1>
      <p className="text-muted mt-2">{t('auth.forgotPassword.subtitle')}</p>

      {IS_COMING_SOON ? (
        <ComingSoonNotice className="mt-8" />
      ) : isSubmitted ? (
        <p className="border-border mt-8 rounded-card border p-4 text-sm">
          {t('auth.forgotPassword.successMessage')}
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              {t('auth.forgotPassword.emailLabel')}
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
                placeholder={t('auth.forgotPassword.emailPlaceholder')}
                className="border-border placeholder:text-muted focus:ring-primary/40 w-full rounded-control border py-2 pr-3 pl-9 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('auth.forgotPassword.submitting') : t('auth.forgotPassword.submit')}
          </Button>
        </form>
      )}

      <p className="mt-5 text-center text-sm">
        <Link to="/login" className="text-primary font-medium">
          {t('auth.forgotPassword.backToSignIn')}
        </Link>
      </p>
    </AuthLayout>
  )
}
