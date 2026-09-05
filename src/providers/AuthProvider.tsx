import type { ReactNode } from 'react'

import { AuthContext, type AuthContextValue } from '@/context/auth-context'
import { useApiMutation } from '@/hooks/useApiMutation'
import { useApiQuery } from '@/hooks/useApiQuery'
import { getMe, login, logout, UnauthenticatedError } from '@/lib/api/auth'
import type { User } from '@/lib/api/auth.types'
import { queryKeys } from '@/lib/query-keys'

async function fetchCurrentUser(): Promise<User | null> {
  try {
    const { user } = await getMe()
    return user
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return null
    }
    throw error
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const meQuery = useApiQuery(queryKeys.me(), fetchCurrentUser, { retry: false })

  const loginMutation = useApiMutation(login, { invalidateKeys: [queryKeys.me()] })
  const logoutMutation = useApiMutation(logout, { invalidateKeys: [queryKeys.me()] })

  const value: AuthContextValue = {
    user: meQuery.data ?? null,
    isLoading: meQuery.isLoading,
    login: async (payload) => {
      await loginMutation.mutateAsync(payload)
    },
    logout: async () => {
      await logoutMutation.mutateAsync()
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
