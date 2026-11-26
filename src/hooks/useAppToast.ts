import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type ToastValues = Record<string, unknown>

/**
 * Thin wrapper around sonner's `toast` that takes an i18n key instead of
 * pre-translated text — every call site used to do `toast.success(t('...'))`
 * (Ticket #83), repeating the same `useTranslation()` + translate-then-pass
 * dance. One place to change if toast behavior itself ever needs to
 * (duration, an action button, ...).
 */
export function useAppToast() {
  const { t } = useTranslation()

  return {
    success: (key: string, values?: ToastValues) => toast.success(t(key, values)),
    error: (key: string, values?: ToastValues) => toast.error(t(key, values)),
    info: (key: string, values?: ToastValues) => toast.info(t(key, values)),
  } as const
}
