import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { FullPageLoader } from '@/components/FullPageLoader'
import { useUserAuthenticationContext } from '@/context/UserAuthenticationContext'

/** Redirects unauthenticated users to /login. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUserAuthenticationContext()

  if (isLoading) {
    return <FullPageLoader />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
