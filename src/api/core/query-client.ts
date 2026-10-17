import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'

import { handleApiError } from '@/api/core/handle-api-error'

interface ApiMeta extends Record<string, unknown> {
  /** Set via the hooks' `suppressErrorToast` option — see handle-api-error.ts. */
  suppressErrorToast?: boolean
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: ApiMeta
    mutationMeta: ApiMeta
  }
}

/**
 * Single QueryClient instance for the app. Import this (or the wrapper
 * hooks in src/api/core/) rather than constructing another QueryClient.
 *
 * Errors from every query/mutation land in the cache-level onError below,
 * which toasts them unless the hook opted out.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (!query.meta?.suppressErrorToast) handleApiError(error)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _onMutateResult, mutation) => {
      if (!mutation.meta?.suppressErrorToast) handleApiError(error)
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
