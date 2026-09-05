import { createContext } from 'react'

import type { LoginPayload, User } from '@/lib/api/auth.types'

export interface AuthContextValue {
  user: User | null
  /** True only while the initial getMe() session check is in flight. */
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
