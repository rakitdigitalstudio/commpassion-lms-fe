import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'

interface AppShellProps {
  /** Defaults to <Outlet/> for its usual role as a router layout route. Explore passes real children instead, since it isn't nested under a route (see Explore.tsx). */
  children?: ReactNode
}

/** Sidebar + topbar shared by every authenticated screen. */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-border/10">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  )
}
