import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useNavigate } from 'react-router-dom'

import { ChevronDownIcon, LogoutIcon, MenuIcon, SearchIcon } from '@/components/icons'
import { useUserAuthenticationContext } from '@/context/UserAuthenticationContext'
import { COURSE_SEARCH_PARAM } from '@/lib/course-search'

const LOCALES = ['en', 'id'] as const

/**
 * Notification bell removed (no notifications feature exists — was a
 * visual-only placeholder). The language control is real: it cycles
 * between the two supported locales (no dropdown menu component exists
 * yet, so a toggle-on-click stands in for one — see TODO.md). The user
 * dropdown is real: it reads from UserAuthenticationContext. Search hands
 * off to Explore (`/explore?q=…`), which does the actual filtering.
 */
interface TopbarProps {
  /** Opens Sidebar's off-canvas drawer below `lg` (Ticket #70). */
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useUserAuthenticationContext()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = search.trim()
    navigate({
      pathname: '/explore',
      search: query ? createSearchParams({ [COURSE_SEARCH_PARAM]: query }).toString() : '',
    })
  }

  function cycleLocale() {
    const current = LOCALES.indexOf(i18n.language as (typeof LOCALES)[number])
    const next = LOCALES[(current + 1) % LOCALES.length]
    void i18n.changeLanguage(next)
  }

  // Same explicit-navigate pattern as Sidebar's logout button — don't rely
  // on ProtectedRoute's reactive redirect once `user` goes null.
  async function handleLogout() {
    setMenuOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex items-center gap-3 border-b border-border bg-background px-4 py-4 sm:gap-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="text-muted shrink-0 lg:hidden"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <form role="search" onSubmit={handleSearch} className="relative min-w-0 max-w-md flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('common.searchCourses')}
          aria-label={t('common.searchCourses')}
          className="w-full rounded-full border border-border bg-border/20 py-2 pr-4 pl-9 text-sm placeholder:text-muted focus:ring-2 focus:ring-primary/40 focus:outline-none"
        />
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={cycleLocale}
          className="hidden items-center gap-1 text-sm font-medium text-muted uppercase sm:flex"
        >
          {i18n.language}
          <ChevronDownIcon className="h-4 w-4" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {user?.fullName.charAt(0) ?? '?'}
            </span>
            <span className="hidden text-sm font-medium sm:inline">
              {user?.fullName ?? 'Guest'}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-muted" />
          </button>

          {menuOpen ? (
            <>
              {/* Click-away layer — sits under the menu, above everything else. */}
              <button
                type="button"
                aria-hidden="true"
                tabIndex={-1}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <div className="absolute top-full right-0 z-20 mt-2 w-44 overflow-hidden rounded-card border border-border bg-background shadow-card">
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-muted hover:bg-border/50"
                >
                  <LogoutIcon className="h-4 w-4 shrink-0" />
                  Logout
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}
