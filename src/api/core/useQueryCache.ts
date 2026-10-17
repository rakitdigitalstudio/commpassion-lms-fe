import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useMemo } from 'react'

/**
 * The only place in the app that calls useQueryClient(). Features read and
 * write the cache through these helpers instead of holding the raw
 * QueryClient, so a TanStack major upgrade that renames/reshapes these
 * methods (it has happened every major so far) only changes this file.
 *
 * Every helper takes a key from src/api/core/query-keys.ts and matches by
 * prefix, same as TanStack's own default — e.g. invalidate(queryKeys.courses())
 * also invalidates every queryKeys.course(courseId) under it.
 */
export function useQueryCache() {
  const queryClient = useQueryClient()

  return useMemo(
    () => ({
      /** Marks matching queries stale and refetches the ones currently on screen. */
      invalidate: (queryKey: QueryKey) => queryClient.invalidateQueries({ queryKey }),

      /** Refetches matching queries right away, whether or not they're stale. */
      refetch: (queryKey: QueryKey) => queryClient.refetchQueries({ queryKey }),

      /** Writes a value straight into the cache — use when a mutation already returned it. */
      setData: <TData>(queryKey: QueryKey, data: TData) =>
        queryClient.setQueryData<TData>(queryKey, data),

      getData: <TData>(queryKey: QueryKey) => queryClient.getQueryData<TData>(queryKey),

      /** Cancels in-flight fetches, e.g. before an optimistic setData. */
      cancel: (queryKey: QueryKey) => queryClient.cancelQueries({ queryKey }),

      /** Drops matching queries from the cache entirely (no refetch). */
      remove: (queryKey: QueryKey) => queryClient.removeQueries({ queryKey }),

      /** Resets matching queries to their initial state and refetches active ones. */
      reset: (queryKey: QueryKey) => queryClient.resetQueries({ queryKey }),
    }),
    [queryClient],
  )
}

export type QueryCache = ReturnType<typeof useQueryCache>
