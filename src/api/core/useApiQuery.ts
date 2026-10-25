import {
  keepPreviousData as keepPreviousDataPlaceholder,
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from '@tanstack/react-query'

/**
 * Options every domain query hook accepts and forwards (enabled, select,
 * staleTime, ...) — everything except the key and fn, which the hook owns.
 */
export type ApiQueryOptions<TData, TKey extends QueryKey = QueryKey> = Omit<
  UseQueryOptions<TData, Error, TData, TKey>,
  'queryKey' | 'queryFn'
> & {
  /** Skip the global error toast — for screens that render the error themselves. */
  suppressErrorToast?: boolean
  /**
   * Keep showing the previous key's data while a new key loads (paging,
   * searching) instead of dropping back to a loading state; the result's
   * `isPlaceholderData` is true meanwhile.
   */
  keepPreviousData?: boolean
}

/**
 * Thin wrapper around useQuery with a stable positional signature —
 * `useApiQuery(queryKey, queryFn, options)` — so a TanStack major that
 * reshapes useQuery's arguments only changes this file. Use this (not
 * useQuery directly; lint enforces it) for every read, so app-wide
 * defaults (staleTime, retry — see src/api/core/query-client.ts) stay in
 * one place. See the README "Data fetching" section.
 */
export function useApiQuery<TData, TKey extends QueryKey = QueryKey>(
  queryKey: TKey,
  queryFn: () => Promise<TData>,
  { suppressErrorToast, keepPreviousData, ...options }: ApiQueryOptions<TData, TKey> = {},
) {
  return useQuery({
    queryKey,
    queryFn,
    ...(keepPreviousData && { placeholderData: keepPreviousDataPlaceholder }),
    ...options,
    meta: { ...options.meta, suppressErrorToast },
  })
}
