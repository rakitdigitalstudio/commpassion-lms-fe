import { useTranslation } from 'react-i18next'

import { BellIcon, ChevronDownIcon, SearchIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'

const LOCALES = ['en', 'id'] as const

/**
 * Notification bell is still a visual placeholder — a notifications
 * feature is its own scope, not this ticket's (#41). The language control
 * is real now: it cycles between the two supported locales (no dropdown
 * menu component exists yet, so a toggle-on-click stands in for one — see
 * TODO.md). The user dropdown is real: it reads from AuthContext.
 */
export function Topbar() {
  const { user } = useAuth()
  const { i18n } = useTranslation()

  function cycleLocale() {
    const current = LOCALES.indexOf(i18n.language as (typeof LOCALES)[number])
    const next = LOCALES[(current + 1) % LOCALES.length]
    void i18n.changeLanguage(next)
  }

  return (
    <header className="flex items-center gap-4 border-b border-border bg-background px-6 py-4">
      <div className="relative max-w-md flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Search modules, courses, or anything..."
          className="w-full rounded-full border border-border bg-border/20 py-2 pr-4 pl-9 text-sm placeholder:text-muted focus:ring-2 focus:ring-primary/40 focus:outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <button
          type="button"
          onClick={cycleLocale}
          className="flex items-center gap-1 text-sm font-medium text-muted uppercase"
        >
          {i18n.language}
          <ChevronDownIcon className="h-4 w-4" />
        </button>

        <button type="button" className="relative rounded-full border border-border p-2">
          <BellIcon className="h-5 w-5 text-muted" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button type="button" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {user?.fullName.charAt(0) ?? '?'}
          </span>
          <span className="text-sm font-medium">{user?.fullName ?? 'Guest'}</span>
          <ChevronDownIcon className="h-4 w-4 text-muted" />
        </button>
      </div>
    </header>
  )
}
