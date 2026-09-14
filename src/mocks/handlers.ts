import { http, HttpResponse, type HttpHandler } from 'msw'

import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from '@/lib/api/auth.types'

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

interface MockAccount {
  user: User
  password: string
}

// Seeded demo account — an "existing" user with purchase history (see
// src/lib/stub-data/), so logging in with it exercises the Dashboard's
// populated state out of the box. Ticket #13: a fresh sign-up gets
// isNewUser: true instead, so the New User dashboard is reachable via the
// real register -> login flow rather than a URL toggle — see
// STUBBED_DATA.md.
const accounts = new Map<string, MockAccount>([
  [
    'marco.herbert@example.com',
    {
      password: 'password123',
      user: {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'marco.herbert@example.com',
        fullName: 'Marco Herbert',
        role: 'student',
        emailVerifiedAt: '2026-01-01T00:00:00Z',
        isNewUser: false,
      },
    },
  ],
])

// In-memory only — resets on every full page reload, since there's no real
// session store yet. Starts unauthenticated so the login redirect flow
// (Ticket #5's acceptance criteria) is the default state to exercise.
let currentUserEmail: string | null = null

export const handlers: HttpHandler[] = [
  http.get('*/api/v1/auth/csrf', () => HttpResponse.json({ csrfToken: 'mock-csrf-token' })),

  http.post('*/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as Partial<LoginPayload>
    const account = body.email ? accounts.get(body.email) : undefined

    if (!account || account.password !== body.password) {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    currentUserEmail = account.user.email
    return HttpResponse.json<AuthResponse>({ user: account.user })
  }),

  http.get('*/api/v1/auth/me', () => {
    const account = currentUserEmail ? accounts.get(currentUserEmail) : undefined

    if (!account) {
      return new HttpResponse(null, { status: 401 })
    }
    return HttpResponse.json<AuthResponse>({ user: account.user })
  }),

  http.post('*/api/v1/auth/logout', () => {
    currentUserEmail = null
    return new HttpResponse(null, { status: 204 })
  }),

  // Does NOT log the user in — matches register() not returning
  // AuthResponse. 409 if the email is already "registered". Marked
  // isNewUser: true so signing in with it afterward shows the Dashboard's
  // New User state.
  http.post('*/api/v1/auth/register', async ({ request }) => {
    const body = (await request.json()) as Partial<RegisterPayload>

    if (body.email && accounts.has(body.email)) {
      return HttpResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 },
      )
    }

    if (body.email && body.password && body.fullName) {
      accounts.set(body.email, {
        password: body.password,
        user: {
          id: crypto.randomUUID(),
          email: body.email,
          fullName: body.fullName,
          role: 'student',
          emailVerifiedAt: null,
          isNewUser: true,
        },
      })
    }

    return new HttpResponse(null, { status: 201 })
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
