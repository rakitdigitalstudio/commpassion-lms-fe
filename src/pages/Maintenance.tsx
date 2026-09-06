import { useTranslation } from 'react-i18next'

import { Logo } from '@/components/Logo'

/**
 * Shown for the whole app when VITE_MAINTENANCE_MODE=true (see App.tsx /
 * src/lib/config.ts) — checked before routing/auth, so it works
 * regardless of backend/session state.
 */
export function Maintenance() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <Logo className="h-16 w-auto" />
      <h1 className="text-display font-bold">{t('common.maintenance.heading')}</h1>
      <p className="text-muted max-w-md">{t('common.maintenance.body')}</p>
    </div>
  )
}
