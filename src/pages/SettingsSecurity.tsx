import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/Button'
import { PasswordField } from '@/components/PasswordField'
import { SectionCard } from '@/components/SectionCard'
import { passwordRules } from '@/lib/password-rules'

/**
 * Settings > Security tab content (Ticket #28). No `changePassword()` API
 * exists yet (blocked on SDS §6, see STUBBED_DATA.md), so "Save Changes"
 * doesn't persist anything — the password-rules checklist is still fully
 * live against local state, reusing the same `passwordRules` list as
 * Register/ResetPassword.
 */
export function SettingsSecurity() {
  const { t } = useTranslation()
  const [newPassword, setNewPassword] = useState('')

  return (
    <>
      <SectionCard
        title={t('settings.security.changePasswordTitle')}
        subtitle={t('settings.security.changePasswordSubtitle')}
      >
        <PasswordField
          label={t('settings.security.currentPasswordLabel')}
          placeholder={t('settings.security.currentPasswordPlaceholder')}
          autoComplete="current-password"
        />

        <div className="flex flex-col gap-2">
          <PasswordField
            label={t('settings.security.newPasswordLabel')}
            placeholder={t('settings.security.newPasswordPlaceholder')}
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          <ul className="space-y-1 pl-[180px]">
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
        />
      </SectionCard>

      <Button variant="primary" className="self-end">
        {t('settings.saveChanges')}
      </Button>
    </>
  )
}
