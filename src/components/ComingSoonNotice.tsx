import { useTranslation } from 'react-i18next'

/**
 * Shown instead of a form on Login/Register/Forgot Password when
 * VITE_IS_COMING_SOON=true (see src/lib/config.ts). Shared so the three
 * pages don't each hand-roll their own version.
 */
export function ComingSoonNotice({ className = '' }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <div className={`border-border rounded-card border border-dashed p-6 text-center ${className}`}>
      <p className="font-semibold">{t('auth.comingSoon.heading')}</p>
      <p className="text-muted mt-1 text-sm">{t('auth.comingSoon.body')}</p>
    </div>
  )
}
