import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { FullPageLoader } from '@/components/FullPageLoader'
import { useUserAuthenticationContext } from '@/context/UserAuthenticationContext'

/** Redirects already-authenticated users to /dashboard (e.g. away from /login). */
export function GuestOnlyRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUserAuthenticationContext()

  if (isLoading) {
    return <FullPageLoader />
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
