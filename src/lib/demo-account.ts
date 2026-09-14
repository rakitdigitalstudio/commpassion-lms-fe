import type { LoginPayload, User } from '@/lib/api/auth.types'

/**
 * TEMPORARY (see STUBBED_DATA.md) — a stubbed demo account so the
 * Dashboard can be shown in a demo without a real backend. Resolved
 * entirely client-side (see matchDemoAccount) rather than through the
 * mock/real login network call, so it works even in an environment
 * where there's no backend and MSW mocks aren't running at all (e.g. a
 * production deploy with VITE_USE_MOCKS unset) — and its session is
 * persisted to localStorage rather than relying on the mock backend's
 * in-memory session (which lives in the MSW service worker and doesn't
 * reliably survive a full page reload anyway). Remove this whole
 * mechanism once a real backend/session exists.
 */
export const DEMO_ACCOUNT_CREDENTIALS = {
  email: 'commpassion',
  password: 'commpassion_admin!2026',
}

export const DEMO_USER: User = {
  id: '22222222-2222-2222-2222-222222222222',
  email: DEMO_ACCOUNT_CREDENTIALS.email,
  fullName: 'CommPassion Demo',
  role: 'student',
  emailVerifiedAt: '2026-01-01T00:00:00Z',
  isNewUser: false,
}

const STORAGE_KEY = 'commpassion.demoSession'

interface DemoSession {
  token: string
  user: User
}

export function isDemoAccountEmail(email: string): boolean {
  return email === DEMO_ACCOUNT_CREDENTIALS.email
}

/**
 * Checks the submitted credentials against the demo account and, on a
 * match, resolves the demo user directly — no network call. Returns null
 * for anything else, so the caller (useLoginMutation) falls through to
 * the real login() request.
 */
export function matchDemoAccount(payload: LoginPayload): User | null {
  if (
    payload.email === DEMO_ACCOUNT_CREDENTIALS.email &&
    payload.password === DEMO_ACCOUNT_CREDENTIALS.password
  ) {
    return DEMO_USER
  }

  return null
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
