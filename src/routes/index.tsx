import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AppShell } from '@/components/AppShell'
import { CourseDetail } from '@/pages/CourseDetail'
import { Dashboard } from '@/pages/Dashboard'
import { Explore } from '@/pages/Explore'
import { ForgotPassword } from '@/pages/ForgotPassword'
import { Login } from '@/pages/Login'
import { NotFound } from '@/pages/NotFound'
import { Purchases } from '@/pages/Purchases'
import { Register } from '@/pages/Register'
import { ResetPassword } from '@/pages/ResetPassword'
import { Settings } from '@/pages/Settings'
import { StyleGuide } from '@/pages/StyleGuide'
import { GuestOnlyRoute } from '@/routes/GuestOnlyRoute'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

export const router = createBrowserRouter([
  // Root has no page of its own — send everyone through /login, which
  // already does the right thing either way: GuestOnlyRoute forwards an
  // authenticated visitor on to /dashboard, and an unauthenticated one
  // sees the coming-soon-locked form when IS_COMING_SOON is true.
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    path: '/login',
    element: (
      <GuestOnlyRoute>
        <Login />
      </GuestOnlyRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestOnlyRoute>
        <Register />
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
  // Reachable regardless of auth state (e.g. a mailed link opened in a
  // session that's already logged in elsewhere) — not guest-gated.
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/style-guide', element: <StyleGuide /> },
  // Catch-all — must stay last. Public, not gated: an unmatched URL isn't
  // "protected content," so redirecting to /login first would be wrong.
  { path: '*', element: <NotFound /> },
])
