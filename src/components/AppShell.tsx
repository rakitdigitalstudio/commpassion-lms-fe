import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'

/** Sidebar + topbar shared by every authenticated screen. Renders the matched child route via Outlet. */
export function AppShell() {
  return (
    <div className="flex min-h-screen bg-border/10">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
