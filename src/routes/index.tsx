import { createBrowserRouter } from 'react-router-dom'

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
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchases',
    element: (
      <ProtectedRoute>
        <Purchases />
      </ProtectedRoute>
    ),
  },
  // Public catalog browsing — no auth required, matches the login page's
  // "Explore Online Courses" CTA for guests. Inferred, not spec'd.
  { path: '/explore', element: <Explore /> },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/courses/:courseId',
    element: (
      <ProtectedRoute>
        <CourseDetail />
      </ProtectedRoute>
    ),
  },
  { path: '/style-guide', element: <StyleGuide /> },
])
