import { API_ENDPOINTS } from '@/api/core/endpoints'
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

export async function getCsrfToken(): Promise<string> {
  const res = await fetch(apiUrl(API_ENDPOINTS.auth.csrf), {
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch CSRF token: ${res.status}`)
  }

  const { csrfToken } = (await res.json()) as { csrfToken: string }

  return csrfToken
}
