import { http, HttpResponse, type HttpHandler } from 'msw'

import type { LoginPayload, ResetPasswordPayload, UserResponse } from '@/api/auth/types'
import { API_ENDPOINTS } from '@/api/core/endpoints'
import { API_ERROR_CODE, type ApiEnvelope, type ApiErrorBody } from '@/api/core/http'

/**
 * MSW request handlers.
 *
 * The auth handlers mirror the Golang API's wire format
 * (commpassion-core-office, internal/delivery/http): `{ data, message }`
 * success bodies, `{ error: { message, code } }` errors and snake_case
 * fields — so the mocks exercise the same mapping code in
 * src/api/auth/service/auth.ts as the real backend (#30).
 */

// Typed as plain Response so one handler can return either body shape —
// MSW otherwise pins a handler's body type to its first return.
function ok<T>(data: T, message: string, status = 200): Response {
  return HttpResponse.json<ApiEnvelope<T>>({ data, message }, { status })
}

function okMessage(message: string, status = 200): Response {
  return HttpResponse.json({ message }, { status })
}

function fail(status: number, code: string, message: string): Response {
  return HttpResponse.json<ApiErrorBody>({ error: { message, code } }, { status })
}

interface RegisterRequest {
  full_name: string
  email: string
  password: string
}

interface MockAccount {
  user: UserResponse
  password: string
}

// Seeded mock account for signing in without registering first. Mock
// accounts never have enrollments (see the /user/* handlers below), so
// every mock login sees the Dashboard's New User state; enrolled states
// need the real API (README "Mocking (MSW)").
const accounts = new Map<string, MockAccount>([
  [
    'marco.herbert@example.com',
    {
      password: 'password123',
      user: {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'marco.herbert@example.com',
        full_name: 'Marco Herbert',
        role: 'student',
      },
    },
  ],
])

// In-memory only — resets on every full page reload, since there's no real
// session store yet. Starts unauthenticated so the login redirect flow
// (Ticket #5's acceptance criteria) is the default state to exercise.
let currentUserEmail: string | null = null

export const handlers: HttpHandler[] = [
  http.get(`*${API_ENDPOINTS.auth.csrf}`, () =>
    ok({ csrf_token: 'mock-csrf-token' }, 'CSRF token retrieved'),
  ),

  http.post(`*${API_ENDPOINTS.auth.login}`, async ({ request }) => {
    const body = (await request.json()) as Partial<LoginPayload>
    const account = body.email ? accounts.get(body.email) : undefined

    if (!account || account.password !== body.password) {
      return fail(401, 'invalid_credentials', 'invalid email or password')
    }

    currentUserEmail = account.user.email
    return ok(account.user, 'Login successful')
  }),

  http.get(`*${API_ENDPOINTS.auth.me}`, () => {
    const account = currentUserEmail ? accounts.get(currentUserEmail) : undefined

    if (!account) {
      return fail(401, 'unauthorized', 'authentication required')
    }
    return ok(account.user, 'Current user')
  }),

  http.post(`*${API_ENDPOINTS.auth.logout}`, () => {
    currentUserEmail = null
    return okMessage('Logged out successfully')
  }),

  // Does NOT log the user in — matches register() not returning
  // AuthResponse. 409 if the email is already "registered".
  http.post(`*${API_ENDPOINTS.auth.register}`, async ({ request }) => {
    const body = (await request.json()) as Partial<RegisterRequest>

    if (!body.email || !body.password || !body.full_name) {
      return fail(400, 'validation_error', 'invalid request body')
    }

    if (accounts.has(body.email)) {
      return fail(409, 'email_taken', 'email already registered')
    }

    const user: UserResponse = {
      id: crypto.randomUUID(),
      email: body.email,
      full_name: body.full_name,
      role: 'student',
    }
    accounts.set(body.email, { password: body.password, user })

    return ok(user, 'Registration successful', 201)
  }),

  // Always the same response regardless of whether the email exists —
  // don't leak account existence, per Ticket #11's acceptance criteria.
  http.post(`*${API_ENDPOINTS.auth.forgotPassword}`, () =>
    okMessage('If the address exists, a reset link has been sent'),
  ),

  // Mock reset token for exercising Ticket #11's reset-password form:
  // any token except "invalid" (or empty) succeeds.
  http.post(`*${API_ENDPOINTS.auth.resetPassword}`, async ({ request }) => {
    const body = (await request.json()) as Partial<ResetPasswordPayload>

    if (!body.token || body.token === 'invalid') {
      return fail(400, API_ERROR_CODE.TOKEN_INVALID, 'reset token is invalid or expired')
    }

    return okMessage('Password has been reset successfully')
  }),

  // Learner data: no mock account is enrolled in anything, so these return
  // the empty state rather than invented courses or numbers.
  http.get(`*${API_ENDPOINTS.user.stats}`, () =>
    ok(
      { courses_enrolled: 0, certificates_count: 0, certificates_in_review: 0 },
      'User statistics',
    ),
  ),
  http.get(`*${API_ENDPOINTS.user.courses}`, () => ok([], 'User courses')),
  http.get(`*${API_ENDPOINTS.user.activities}`, () => ok([], 'User activities')),
]
