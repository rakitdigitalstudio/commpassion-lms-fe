import { NavLink, useNavigate } from 'react-router-dom'

import {
  CartIcon,
  CloseIcon,
  DashboardIcon,
  GlobeIcon,
  LogoutIcon,
  SettingsIcon,
} from '@/components/icons'
import { Logo } from '@/components/Logo'
import { useUserAuthenticationContext } from '@/context/UserAuthenticationContext'

const navItems = [
  { to: '/dashboard', label: 'My Dashboard', icon: DashboardIcon },
  { to: '/purchases', label: 'My Purchases', icon: CartIcon },
  { to: '/explore', label: 'Explore Online Courses', icon: GlobeIcon },
]

const navItemClassName = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-control border-l-2 px-3 py-2 text-sm font-medium ${
    isActive
      ? 'border-primary bg-primary/10 text-primary'
      : 'border-transparent text-muted hover:bg-border/50'
  }`

interface SidebarProps {
  /** Below `lg`, Sidebar is an off-canvas drawer — open state lives in AppShell. */
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useUserAuthenticationContext()
  const navigate = useNavigate()

  // Explicit navigate rather than relying on ProtectedRoute's reactive
  // redirect once `user` goes null (Ticket #12) — same pattern as
  // useLoginForm's post-login navigate, and avoids depending on render
  // timing after the auth cache updates.
  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 -translate-x-full flex-col overflow-y-auto border-r border-border bg-background transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : ''
        }`}
      >
        <div className="flex items-center gap-2 p-6">
          <Logo className="h-8 w-auto shrink-0" />
          <div className="flex-1">
            <p className="font-bold leading-tight">CommPassion</p>
            <p className="text-xs leading-tight text-muted">E-Learning Dashboard</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-muted lg:hidden"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map(({ to, label, icon: NavIcon }) => (
            <NavLink key={to} to={to} className={navItemClassName} onClick={onClose}>
              <NavIcon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-border px-3 py-4">
          <NavLink to="/settings" className={navItemClassName} onClick={onClose}>
            <SettingsIcon className="h-5 w-5 shrink-0" />
            Settings
          </NavLink>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex w-full items-center gap-3 rounded-control border-l-2 border-transparent px-3 py-2 text-left text-sm font-medium text-muted hover:bg-border/50"
          >
            <LogoutIcon className="h-5 w-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
