import { http, HttpResponse, type HttpHandler } from 'msw'

import type { AuthResponse, LoginPayload, ResetPasswordPayload, User } from '@/lib/api/auth.types'

/**
 * MSW request handlers.
 *
 * MOSTLY BLOCKED (see TODO.md): handlers for the SDS §5/§2 endpoints
 * beyond auth can't be written yet — we don't have SDS §6 (response
 * shapes) or §2, and the client modules they'd intercept (Ticket #3)
 * aren't built either.
 *
 * The auth handlers below are the exception, added for Ticket #5: they're
 * PROVISIONAL, built from usual login/getMe/logout conventions rather than
 * a confirmed spec (see auth.types.ts). Replace/confirm once SDS §6 lands.
 */

const mockUser: User = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'marco.herbert@example.com',
  fullName: 'Marco Herbert',
  role: 'student',
  emailVerifiedAt: '2026-01-01T00:00:00Z',
}

// Mock-valid credentials for exercising the Ticket #9 login form. Any
// other email/password combination is treated as invalid (401).
const MOCK_CREDENTIALS = { email: mockUser.email, password: 'password123' }

// In-memory only — resets on every full page reload, since there's no real
// session store yet. Starts unauthenticated so the login redirect flow
// (Ticket #5's acceptance criteria) is the default state to exercise.
let isAuthenticated = false

export const handlers: HttpHandler[] = [
  http.get('*/api/v1/auth/csrf', () => HttpResponse.json({ csrfToken: 'mock-csrf-token' })),

  http.post('*/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as Partial<LoginPayload>

    if (body.email !== MOCK_CREDENTIALS.email || body.password !== MOCK_CREDENTIALS.password) {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    isAuthenticated = true
    return HttpResponse.json<AuthResponse>({ user: mockUser })
  }),

  http.get('*/api/v1/auth/me', () => {
    if (!isAuthenticated) {
      return new HttpResponse(null, { status: 401 })
    }
    return HttpResponse.json<AuthResponse>({ user: mockUser })
  }),

  http.post('*/api/v1/auth/logout', () => {
    isAuthenticated = false
    return new HttpResponse(null, { status: 204 })
  }),

  // Always the same response regardless of whether the email exists —
  // don't leak account existence, per Ticket #11's acceptance criteria.
  http.post('*/api/v1/auth/forgot-password', () => new HttpResponse(null, { status: 204 })),

  // Mock reset token for exercising Ticket #11's reset-password form:
  // any token except "invalid" (or empty) succeeds.
  http.post('*/api/v1/auth/reset-password', async ({ request }) => {
    const body = (await request.json()) as Partial<ResetPasswordPayload>

    if (!body.token || body.token === 'invalid') {
      return HttpResponse.json({ message: 'Invalid or expired reset link' }, { status: 400 })
    }

    return new HttpResponse(null, { status: 204 })
  }),
]
