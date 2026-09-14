import type { User } from '@/lib/api/auth.types'

/**
 * TEMPORARY (see STUBBED_DATA.md) — a stubbed demo account + a
 * localStorage session bypass, so the Dashboard can be shown in a demo
 * without depending on the mock backend's in-memory session (which lives
 * in the MSW service worker and doesn't reliably survive a full page
 * reload). Signing in with these exact credentials persists the
 * resulting user to localStorage; every other account still goes
 * through the normal cookie-based mock flow untouched. Remove this
 * whole mechanism once a real backend/session exists.
 */
export const DEMO_ACCOUNT_CREDENTIALS = {
  email: 'commpassion',
  password: 'commpassion_admin!2026',
}

const STORAGE_KEY = 'commpassion.demoSession'

interface DemoSession {
  token: string
  user: User
}

export function isDemoAccountEmail(email: string): boolean {
  return email === DEMO_ACCOUNT_CREDENTIALS.email
}

/** Call after a successful login as the demo account. */
export function saveDemoSession(user: User): void {
  const session: DemoSession = { token: crypto.randomUUID(), user }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // Storage can throw (private browsing, quota, disabled) — the demo
    // bypass just silently won't persist; the real login flow still works.
  }
}

/** Returns the stored demo user, if any — checked before hitting getMe(). */
export function loadDemoSession(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    return (JSON.parse(raw) as DemoSession).user
  } catch {
    return null
  }
}

/** Call on every logout, and before any non-demo login, so a stale demo session never shadows a real one. */
export function clearDemoSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
