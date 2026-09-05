import { createBrowserRouter } from 'react-router-dom'

import { CourseDetail } from '@/pages/CourseDetail'
import { Dashboard } from '@/pages/Dashboard'
import { Explore } from '@/pages/Explore'
import { Login } from '@/pages/Login'
import { Purchases } from '@/pages/Purchases'
import { Settings } from '@/pages/Settings'

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/purchases', element: <Purchases /> },
  { path: '/explore', element: <Explore /> },
  { path: '/settings', element: <Settings /> },
  { path: '/courses/:courseId', element: <CourseDetail /> },
])
