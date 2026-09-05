import { createBrowserRouter } from 'react-router-dom'

import { AppShell } from '@/components/AppShell'
import { CourseDetail } from '@/pages/CourseDetail'
import { Dashboard } from '@/pages/Dashboard'
import { Explore } from '@/pages/Explore'
import { Login } from '@/pages/Login'
import { Purchases } from '@/pages/Purchases'
import { Settings } from '@/pages/Settings'
import { StyleGuide } from '@/pages/StyleGuide'
import { GuestOnlyRoute } from '@/routes/GuestOnlyRoute'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestOnlyRoute>
        <Login />
      </GuestOnlyRoute>
    ),
  },
  {
    // Single AppShell (sidebar + topbar) wraps every protected route via
    // Outlet, per Ticket #7's acceptance criteria.
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/purchases', element: <Purchases /> },
      { path: '/settings', element: <Settings /> },
      { path: '/courses/:courseId', element: <CourseDetail /> },
    ],
  },
  // Public catalog browsing, outside the shell — no mockup shows an
  // authenticated /explore with sidebar/topbar (Ticket #7 only covers
  // "authenticated screens"), and it's reachable while logged out (login
  // page's "Explore Online Courses" CTA). Revisit alongside Ticket #20.
  { path: '/explore', element: <Explore /> },
  { path: '/style-guide', element: <StyleGuide /> },
])
