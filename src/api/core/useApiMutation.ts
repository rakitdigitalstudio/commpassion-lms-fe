import { useMutation, type QueryKey, type UseMutationOptions } from '@tanstack/react-query'

import { useQueryCache } from '@/api/core/useQueryCache'

/**
 * Options every domain mutation hook accepts and forwards (onSuccess,
 * onError, onSettled, invalidateKeys, ...). Typed here so domain hooks
 * never import TanStack's option types themselves.
 */
export interface ApiMutationOptions<TData, TVariables = void> extends Omit<
  UseMutationOptions<TData, Error, TVariables>,
  'mutationFn'
> {
  /** Query keys to invalidate after a successful mutation. */
  invalidateKeys?: QueryKey[]
  /** Skip the global error toast — for screens that render the error themselves. */
  suppressErrorToast?: boolean
}

/**
 * Thin wrapper around useMutation with a stable positional signature —
 * `useApiMutation(mutationFn, options)` — so a TanStack major that
 * reshapes useMutation's arguments only changes this file. Use this (not
 * useMutation directly; lint enforces it) for every write, so cache
 * invalidation is declared next to the mutation instead of scattered
 * across call sites. See the README "Data fetching" section.
 */
export function useApiMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  {
    invalidateKeys,
    suppressErrorToast,
    onSuccess,
    ...options
  }: ApiMutationOptions<TData, TVariables> = {},
) {
  const queryCache = useQueryCache()

  return useMutation({
    mutationFn,
    ...options,
    meta: { ...options.meta, suppressErrorToast },
    onSuccess: (data, variables, onMutateResult, context) => {
      invalidateKeys?.forEach((queryKey) => {
        void queryCache.invalidate(queryKey)
      })
      return onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}
