import { useTranslation } from 'react-i18next'

import { useSetIsNewUserMutation } from '@/api/user/mutations/useSetIsNewUserMutation'
import { Button } from '@/components/Button'
import { SectionCard } from '@/components/SectionCard'
import { Switch } from '@/components/Switch'
import { TextField } from '@/components/TextField'
import { useUserAuthenticationContext } from '@/context/UserAuthenticationContext'

/**
 * Settings > Profile tab content (Ticket #27). Inputs are local-only —
 * the Golang API has no profile endpoint (see STUBBED_DATA.md), so "Save Changes"
 * doesn't persist anything. Prefilled fields are limited to what the
 * real auth session already has (fullName); the rest match the Figma's
 * empty-placeholder state.
 */
export function SettingsProfile() {
  const { t } = useTranslation()
  const { user } = useUserAuthenticationContext()
  const initial = user?.fullName.charAt(0) ?? '?'
  const setIsNewUser = useSetIsNewUserMutation()

  return (
    <>
      <SectionCard
        title={t('settings.profile.publicProfileTitle')}
        subtitle={t('settings.profile.publicProfileSubtitle')}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
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

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <div className="sm:w-[168px] sm:shrink-0">
            <p className="text-sm font-medium">{t('settings.profile.fullNameLabel')}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-1 sm:flex-row">
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

      <SectionCard
        title={t('settings.learning.title')}
        subtitle={t('settings.learning.subtitle')}
      >
        <div className="flex items-center justify-between gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{t('settings.learning.introVideoLabel')}</p>
            <p className="text-sm text-muted">{t('settings.learning.introVideoHint')}</p>
          </div>
          <Switch
            checked={user?.isNewUser ?? false}
            onChange={(checked) => setIsNewUser.mutate(checked)}
            disabled={setIsNewUser.isPending}
            aria-label={t('settings.learning.introVideoLabel')}
          />
        </div>
      </SectionCard>

      <Button variant="primary" className="self-end">
        {t('settings.saveChanges')}
      </Button>
    </>
  )
}
