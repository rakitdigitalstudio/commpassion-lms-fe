import { API_ENDPOINTS, HTTP_METHOD } from '@/api/core/endpoints'
import { API_URL, STRAPI_URL } from '@/lib/config'

/**
 * Shared bits of every Golang API call. Each mutating request needs a
 * fresh CSRF token in the X-CSRF-Token header plus credentials:'include'
 * (Ticket #3); keeping that here means new service modules (checkout,
 * certificates, ...) don't each copy it.
 */

/** Full URL for a path from API_ENDPOINTS. */
export function apiUrl(path: string): string {
  return `${API_URL}${path}`
}

/**
 * Full URL for a Strapi path (STRAPI_ENDPOINTS) or media URL. Media is
 * already absolute when Strapi's upload provider is MinIO, relative
 * (/uploads/...) with the local provider — both are handled.
 */
export function strapiUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${STRAPI_URL}${path}`
}

/** Every Golang API success body. `data` is absent when there's nothing to return (logout, forgot password, ...). */
export interface ApiEnvelope<T> {
  data: T
  message: string
}

/** Every Golang API error body (internal/delivery/http/response). */
export interface ApiErrorBody {
  error: { message: string; code: string }
}

/** `error.code` values the frontend branches on — see the Go handlers for the full list. */
export const API_ERROR_CODE = {
  TOKEN_INVALID: 'token_invalid',
  VALIDATION_ERROR: 'validation_error',
  CSRF_INVALID: 'csrf_invalid',
  RATE_LIMITED: 'rate_limited',
  INVALID_CURRENT_PASSWORD: 'invalid_current_password',
} as const

export type ApiErrorCode = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE]

/** A non-2xx Golang API response, with its `error.code` when the body had one. */
export class ApiError extends Error {
  readonly status: number
  readonly code: string | null

  constructor(status: number, code: string | null) {
    super(`API request failed: ${status}${code ? ` (${code})` : ''}`)
    this.status = status
    this.code = code
  }
}

/** GETs a session-authenticated Golang endpoint and unwraps its `data`. */
export async function getApiData<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), { credentials: 'include' })

  if (!res.ok) {
    throw new ApiError(res.status, await readErrorCode(res))
  }

  return readData<T>(res)
}

/** Unwraps the `{ data, message }` envelope of a successful response. */
export async function readData<T>(res: Response): Promise<T> {
  const { data } = (await res.json()) as ApiEnvelope<T>
  return data
}

/** `error.code` of a failed response, or null when the body isn't the API's error shape. */
export async function readErrorCode(res: Response): Promise<string | null> {
  try {
    const body = (await res.json()) as Partial<ApiErrorBody>
    return body.error?.code ?? null
  } catch {
    return null
  }
}

export async function getCsrfToken(): Promise<string> {
  const res = await fetch(apiUrl(API_ENDPOINTS.auth.csrf), {
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch CSRF token: ${res.status}`)
  }

  const { csrf_token } = await readData<{ csrf_token: string }>(res)

  return csrf_token
}

/** `error.message` of a failed response, or null when the body isn't the API's error shape. */
export async function readErrorMessage(res: Response): Promise<string | null> {
  try {
    const body = (await res.json()) as Partial<ApiErrorBody>
    return body.error?.message ?? null
  } catch {
    return null
  }
}

/** Seconds from a `Retry-After` header (always seconds per the handoff, never an HTTP-date), or null if absent/unparseable. */
export function readRetryAfterSeconds(res: Response): number | null {
  const header = res.headers.get('Retry-After')
  const seconds = header ? Number(header) : NaN
  return Number.isFinite(seconds) ? seconds : null
}

async function postJson(path: string, body: unknown, csrfToken: string): Promise<Response> {
  return fetch(apiUrl(path), {
    method: HTTP_METHOD.POST,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(body),
  })
}

/**
 * POSTs an auth endpoint with a fresh CSRF token, retrying once with
 * another fresh token if the first attempt comes back `csrf_invalid` —
 * every mutating auth call needs this per the backend handoff, so it
 * lives here instead of being copied into forgotPassword/resetPassword/
 * changePassword individually.
 */
export async function postWithCsrfRetry(path: string, body: unknown): Promise<Response> {
  const first = await postJson(path, body, await getCsrfToken())

  if (first.ok || (await readErrorCode(first.clone())) !== API_ERROR_CODE.CSRF_INVALID) {
    return first
  }

  return postJson(path, body, await getCsrfToken())
}
