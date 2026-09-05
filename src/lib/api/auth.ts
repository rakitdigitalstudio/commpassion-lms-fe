import type { AuthResponse, LoginPayload } from '@/lib/api/auth.types'

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

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`)
  }

  return res.json() as Promise<AuthResponse>
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
