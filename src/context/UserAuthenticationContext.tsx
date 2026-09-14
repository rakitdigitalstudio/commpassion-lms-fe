import { createContext, useContext, type ReactNode } from 'react'

import { useUserAuthentication, type UserAuthenticationValue } from '@/hooks/useUserAuthentication'

export const UserAuthenticationContext = createContext<UserAuthenticationValue | undefined>(
  undefined,
)

/** Wraps the app once (see App.tsx). Holds no logic of its own — see useUserAuthentication. */
export function UserAuthenticationProvider({ children }: { children: ReactNode }) {
  const value = useUserAuthentication()

  return (
    <UserAuthenticationContext.Provider value={value}>
      {children}
    </UserAuthenticationContext.Provider>
  )
}

export function useUserAuthenticationContext(): UserAuthenticationValue {
  const context = useContext(UserAuthenticationContext)

  if (!context) {
    throw new Error('useUserAuthenticationContext must be used within a UserAuthenticationProvider')
  }

  return context
}
