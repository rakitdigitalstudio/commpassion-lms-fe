import { useTranslation } from 'react-i18next'

import { Button } from '@/components/Button'
import { SectionCard } from '@/components/SectionCard'
import { TextField } from '@/components/TextField'
import { useUserAuthenticationContext } from '@/context/UserAuthenticationContext'

/**
 * Settings > Profile tab content (Ticket #27). Inputs are local-only —
 * no `getProfile()`/`updateProfile()` API exists yet (blocked on SDS §6,
 * same as everywhere else — see STUBBED_DATA.md), so "Save Changes"
 * doesn't persist anything. Prefilled fields are limited to what the
 * real auth session already has (fullName); the rest match the Figma's
 * empty-placeholder state.
 */
export function SettingsProfile() {
  const { t } = useTranslation()
  const { user } = useUserAuthenticationContext()
  const initial = user?.fullName.charAt(0) ?? '?'

  return (
    <>
      <SectionCard
        title={t('settings.profile.publicProfileTitle')}
        subtitle={t('settings.profile.publicProfileSubtitle')}
      >
        <div className="flex items-center gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{t('settings.profile.photoLabel')}</p>
            <p className="text-sm text-muted">{t('settings.profile.photoHint')}</p>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
              {initial}
            </span>
            <div className="flex flex-col gap-2 text-sm">
              <button type="button" className="text-left font-bold text-primary">
                {t('settings.profile.uploadPhoto')}
              </button>
              <button type="button" className="text-left text-muted">
                {t('settings.profile.removePhoto')}
              </button>
            </div>
          </div>
        </div>

        <hr className="border-border" />

        <div className="flex w-full items-center gap-3">
          <div className="w-[168px] shrink-0">
            <p className="text-sm font-medium">{t('settings.profile.fullNameLabel')}</p>
          </div>
          <input
            defaultValue={user?.fullName}
            placeholder={t('settings.profile.firstNamePlaceholder')}
            className="h-10 flex-1 rounded-control border border-muted-2 px-4 py-2 text-sm placeholder:text-muted-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
          <input
            placeholder={t('settings.profile.lastNamePlaceholder')}
            className="h-10 flex-1 rounded-control border border-muted-2 px-4 py-2 text-sm placeholder:text-muted-2 focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>

        <TextField
          label={t('settings.profile.jobTitleLabel')}
          placeholder={t('settings.profile.jobTitlePlaceholder')}
        />
        <TextField
          label={t('settings.profile.companyLabel')}
          placeholder={t('settings.profile.companyPlaceholder')}
        />
      </SectionCard>

      <SectionCard
        title={t('settings.profile.accountDetailsTitle')}
        subtitle={t('settings.profile.accountDetailsSubtitle')}
      >
        <TextField
          label={t('settings.profile.emailLabel')}
          hint={t('settings.profile.emailHint')}
          defaultValue={user?.email}
          placeholder={t('settings.profile.emailPlaceholder')}
        />
      </SectionCard>

      <Button variant="primary" className="self-end">
        {t('settings.saveChanges')}
      </Button>
    </>
  )
}
