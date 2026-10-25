import { STRAPI_ENDPOINTS } from '@/api/core/endpoints'
import { strapiUrl } from '@/api/core/http'
import type { SiteConfig, StrapiSiteConfig } from '@/api/site-config/types'

async function fetchSiteConfig(locale?: string): Promise<StrapiSiteConfig | null> {
  const params = new URLSearchParams({ 'populate[0]': 'achievements' })
  if (locale) params.set('locale', locale)

  const res = await fetch(`${strapiUrl(STRAPI_ENDPOINTS.siteConfig)}?${params}`)

  // A locale with no translation yet comes back empty (or 404), not as an error worth surfacing.
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error(`getSiteConfig failed: ${res.status}`)
  }

  const { data } = (await res.json()) as { data: StrapiSiteConfig | null }

  return data
}

/**
 * Site Config in the visitor's language, falling back to Strapi's default
 * locale when that translation hasn't been entered yet (e.g. `id` today).
 */
export async function getSiteConfig(locale: string): Promise<SiteConfig> {
  const config = (await fetchSiteConfig(locale)) ?? (await fetchSiteConfig())

  return { achievements: config?.achievements ?? [] }
}
