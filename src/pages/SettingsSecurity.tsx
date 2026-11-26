import { useTranslation } from 'react-i18next'

import { Button } from '@/components/Button'
import { PasswordField } from '@/components/PasswordField'
import { SectionCard } from '@/components/SectionCard'
import { useChangePasswordForm } from '@/hooks/useChangePasswordForm'
import { passwordRules } from '@/lib/password-rules'

/**
 * Settings > Security tab content (Ticket #28), wired to the real
 * `POST /api/v1/auth/change-password` endpoint per Ticket #81/backend PR
 * #109 — "Save Changes" now persists for real. Error states (wrong
 * current password, validation_error, 401, 429) come from
 * useChangePasswordForm.
 */
export function SettingsSecurity() {
  const { t } = useTranslation()
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    currentPasswordError,
    newPasswordError,
    retryAfterSeconds,
    isSubmitting,
    submit,
  } = useChangePasswordForm()

  return (
    <>
      <SectionCard
        title={t('settings.security.changePasswordTitle')}
        subtitle={t('settings.security.changePasswordSubtitle')}
      >
        {retryAfterSeconds !== null ? (
          <p role="alert" className="bg-warning/10 text-warning rounded-control p-3 text-sm">
            {t('common.errors.rateLimited', { seconds: retryAfterSeconds })}
          </p>
        ) : null}

        <PasswordField
          label={t('settings.security.currentPasswordLabel')}
          placeholder={t('settings.security.currentPasswordPlaceholder')}
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          error={currentPasswordError}
        />

        <div className="flex flex-col gap-2">
          <PasswordField
            label={t('settings.security.newPasswordLabel')}
            placeholder={t('settings.security.newPasswordPlaceholder')}
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            error={newPasswordError}
          />
          <ul className="space-y-1 sm:pl-[180px]">
            {passwordRules.map((rule) => {
              const isMet = rule.test(newPassword)
              return (
                <li key={rule.id} className={`text-sm ${isMet ? 'text-success' : 'text-muted'}`}>
                  {isMet ? '✓' : '•'} {t(rule.labelKey)}
                </li>
              )
            })}
          </ul>
        </div>

        <PasswordField
          label={t('settings.security.confirmPasswordLabel')}
          placeholder={t('settings.security.confirmPasswordPlaceholder')}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </SectionCard>

      <Button variant="primary" className="self-end" isLoading={isSubmitting} onClick={submit}>
        {t('settings.saveChanges')}
      </Button>
    </>
  )
}
