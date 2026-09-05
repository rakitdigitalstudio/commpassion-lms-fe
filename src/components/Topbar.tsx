import { BellIcon, ChevronDownIcon, SearchIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'

/**
 * Language dropdown and notification bell are visual placeholders here —
 * actual i18n switching and a notifications list are their own scope, not
 * this ticket's. The user dropdown is real: it reads from AuthContext.
 */
export function Topbar() {
  const { user } = useAuth()

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
        <button type="button" className="flex items-center gap-1 text-sm font-medium text-muted">
          EN
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
