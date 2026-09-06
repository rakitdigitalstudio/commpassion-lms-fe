import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '@/lib/api/auth.types'

/**
 * PROVISIONAL Golang auth client (see auth.types.ts). Endpoint paths match
 * SDS §5; CSRF header injection + credentials:'include' match Ticket #3's
 * requirement for the Golang client wrapper. Intercepted by the MSW
 * handlers in src/mocks/handlers.ts until a real backend exists.
 */

const API_URL = import.meta.env.VITE_API_URL ?? ''

/** Thrown by getMe() specifically for "no session" (401), so callers can
 * treat "not logged in" as a normal resolved state instead of an error. */
export class UnauthenticatedError extends Error {}

/** Thrown by login() on a 401 (wrong email/password), so the form can
 * show a generic "invalid credentials" message instead of a network error. */
export class InvalidCredentialsError extends Error {}

/** Thrown by resetPassword() on a 400/401 (invalid or expired token). */
export class InvalidResetTokenError extends Error {}

/** Thrown by register() on a 409 (email already registered). */
export class EmailAlreadyRegisteredError extends Error {}

async function getCsrfToken(): Promise<string> {
  const res = await fetch(`${API_URL}/api/v1/auth/csrf`, {
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch CSRF token: ${res.status}`)
  }

  const { csrfToken } = (await res.json()) as { csrfToken: string }

  return csrfToken
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const csrfToken = await getCsrfToken()

  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(payload),
  })

  if (res.status === 401) {
    throw new InvalidCredentialsError('Invalid email or password')
  }

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`)
  }

  return res.json() as Promise<AuthResponse>
}

/**
 * Does NOT log the user in — per your decision, registration always
 * redirects to /login afterward rather than starting a session, so this
 * intentionally returns void instead of AuthResponse.
 */
export async function register(payload: RegisterPayload): Promise<void> {
  const csrfToken = await getCsrfToken()

  const res = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(payload),
  })

  if (res.status === 409) {
    throw new EmailAlreadyRegisteredError('An account with this email already exists')
  }

  if (!res.ok) {
    throw new Error(`register failed: ${res.status}`)
  }
}

export async function getMe(): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/v1/auth/me`, {
    credentials: 'include',
  })

  if (res.status === 401) {
    throw new UnauthenticatedError('Not authenticated')
  }

  if (!res.ok) {
    throw new Error(`getMe failed: ${res.status}`)
  }

  return res.json() as Promise<AuthResponse>
}

export async function logout(): Promise<void> {
  const csrfToken = await getCsrfToken()

  const res = await fetch(`${API_URL}/api/v1/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-CSRF-Token': csrfToken },
  })

  if (!res.ok) {
    throw new Error(`Logout failed: ${res.status}`)
  }
}

/**
 * Always resolves on a 2xx/4xx alike from the caller's point of view —
 * the backend intentionally returns the same response whether or not the
 * email exists (don't leak account existence), so there's nothing to
 * branch on here. A genuine network/server error still throws.
 */
export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  const csrfToken = await getCsrfToken()

  const res = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`forgotPassword failed: ${res.status}`)
  }
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  const csrfToken = await getCsrfToken()

  const res = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(payload),
  })

  if (res.status === 400 || res.status === 401) {
    throw new InvalidResetTokenError('Invalid or expired reset link')
  }

  if (!res.ok) {
    throw new Error(`resetPassword failed: ${res.status}`)
  }
}
