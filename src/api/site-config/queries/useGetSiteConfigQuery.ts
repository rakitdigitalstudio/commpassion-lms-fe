import { queryKeys } from '@/api/core/query-keys'
import { useApiQuery, type ApiQueryOptions } from '@/api/core/useApiQuery'
import { getSiteConfig } from '@/api/site-config/service/site-config'
import type { SiteConfig } from '@/api/site-config/types'

/** Strapi Site Config for `locale` (falls back to the default locale). */
export function useGetSiteConfigQuery(
  locale: string,
  options?: ApiQueryOptions<SiteConfig, ReturnType<typeof queryKeys.siteConfig>>,
) {
  return useApiQuery(queryKeys.siteConfig(locale), () => getSiteConfig(locale), options)
}
