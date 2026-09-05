import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
} from '@tanstack/react-query'

interface UseApiMutationOptions<TData, TVariables> extends UseMutationOptions<
  TData,
  Error,
  TVariables
> {
  /** Query keys to invalidate after a successful mutation. */
  invalidateKeys?: QueryKey[]
}

/**
 * Thin wrapper around useMutation. Use this (not useMutation directly) for
 * every write to the Strapi/Golang clients, so cache invalidation is
 * declared next to the mutation instead of scattered across call sites.
 * See the README "Data fetching" section for the full rules.
 */
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  { invalidateKeys, onSuccess, ...options }: UseApiMutationOptions<TData, TVariables> = {},
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      invalidateKeys?.forEach((queryKey) => {
        void queryClient.invalidateQueries({ queryKey })
      })
      onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}
