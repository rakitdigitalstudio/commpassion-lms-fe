import { toast } from 'sonner'

import i18n from '@/lib/i18n'

/**
 * App-wide fallback for a failed query/mutation — wired into the
 * QueryClient's caches (src/api/core/query-client.ts), so service
 * functions just throw and no call site needs its own try/catch.
 *
 * Screens that render the error themselves (inline form errors, a
 * not-found state) opt out with `suppressErrorToast: true` on the hook,
 * so the user isn't told twice.
 */
export function handleApiError(error: unknown): void {
  if (import.meta.env.DEV) {
    console.error(error)
  }

  toast.error(i18n.t('common.errors.generic'))
}
