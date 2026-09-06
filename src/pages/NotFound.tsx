import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { Logo } from '@/components/Logo'

/** Catch-all for any unmatched route (src/routes/index.tsx, path: '*'). */
export function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <Logo className="h-16 w-auto" />
      <p className="text-primary text-stat font-bold">{t('common.notFound.code')}</p>
      <h1 className="text-h2 font-bold">{t('common.notFound.heading')}</h1>
      <p className="text-muted max-w-md">{t('common.notFound.body')}</p>
      <Link to="/dashboard" className="mt-2">
        <Button variant="primary">{t('common.notFound.backHome')}</Button>
      </Link>
    </div>
  )
}
