import { useTranslation } from 'react-i18next'
import { NavLink, Outlet } from 'react-router-dom'

import { Card } from '@/components/Card'
import { PageHeader } from '@/components/PageHeader'

const tabs = [
  { to: '/settings/profile', labelKey: 'settings.tabs.profile', icon: '👤' },
  { to: '/settings/security', labelKey: 'settings.tabs.security', icon: '🔒' },
]

const tabClassName = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-4 rounded-control px-4 py-2 text-sm font-medium ${
    isActive ? 'bg-primary/25 text-info' : 'text-muted hover:bg-border/50'
  }`

/**
 * Settings shell (Ticket #26) — tab nav + <Outlet/> for the Profile/
 * Security routes, so switching tabs doesn't full-reload. Tab *content*
 * (Tickets #27/#28) lives in SettingsProfile.tsx/SettingsSecurity.tsx.
 */
export function Settings() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <div className="flex items-start gap-5">
        <Card className="flex w-60 shrink-0 flex-col gap-2">
          {tabs.map((tab) => (
            <NavLink key={tab.to} to={tab.to} className={tabClassName}>
              <span aria-hidden="true">{tab.icon}</span>
              {t(tab.labelKey)}
            </NavLink>
          ))}
        </Card>

        <div className="flex flex-1 flex-col gap-5">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
