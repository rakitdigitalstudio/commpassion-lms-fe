import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query'

/**
 * Thin wrapper around useQuery. Use this (not useQuery directly) for every
 * read from the Strapi/Golang clients, so app-wide defaults (staleTime,
 * retry — see src/lib/query-client.ts) stay in one place. See the README
 * "Data fetching" section for the full rules.
 */
export function useApiQuery<TData, TKey extends QueryKey = QueryKey>(
  queryKey: TKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, Error, TData, TKey>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  })
}
