import { QueryClient } from '@tanstack/react-query'

/**
 * Single QueryClient instance for the app. Import this (or the wrapper
 * hooks in src/hooks/) rather than constructing another QueryClient.
 */
export const queryClient = new QueryClient({
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
