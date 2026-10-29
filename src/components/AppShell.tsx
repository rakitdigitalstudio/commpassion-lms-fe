import { useState, type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'

interface AppShellProps {
  /** Defaults to <Outlet/> for its usual role as a router layout route. Explore passes real children instead, since it isn't nested under a route (see Explore.tsx). */
  children?: ReactNode
}

/**
 * Sidebar + topbar shared by every authenticated screen.
 *
 * Fixed to the viewport height (`h-screen overflow-hidden`) rather than
 * `min-h-screen` on a plain flow layout (Ticket #51) — that let the whole
 * page grow taller than the viewport and scroll as one unit, carrying the
 * Sidebar/Topbar away with it. Only `<main>` scrolls now; Sidebar and
 * Topbar stay in place regardless of how much content the page has.
 *
 * Below `lg` (Ticket #70), Sidebar becomes an off-canvas drawer opened via
 * Topbar's menu button instead of a permanent column — there isn't room
 * for both the nav and page content on a phone/tablet width.
 */
export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-border/10">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  )
}
