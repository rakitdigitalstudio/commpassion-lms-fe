import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { Logo } from '@/components/Logo'

/** Public catalog page — not built yet (Ticket #20). Placeholder "under construction" state. */
export function Explore() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <Logo className="h-16 w-auto" />
      <EmptyState
        icon="🚧"
        heading={t('common.underConstruction.heading')}
        subtext={t('common.underConstruction.body')}
        cta={
          <Link to="/login">
            <Button variant="outline">{t('common.underConstruction.backToLogin')}</Button>
          </Link>
        }
      />
    </div>
  )
}
