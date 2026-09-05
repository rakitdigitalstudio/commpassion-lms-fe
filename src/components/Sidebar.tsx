import { NavLink } from 'react-router-dom'

import {
  CartIcon,
  DashboardIcon,
  GlobeIcon,
  LogoIcon,
  LogoutIcon,
  SettingsIcon,
} from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'

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

export function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-background">
      <div className="flex items-center gap-2 p-6">
        <LogoIcon className="h-8 w-8 shrink-0 text-primary" />
        <div>
          <p className="font-bold leading-tight">CommPassion</p>
          <p className="text-xs leading-tight text-muted">E-Learning Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: NavIcon }) => (
          <NavLink key={to} to={to} className={navItemClassName}>
            <NavIcon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-border px-3 py-4">
        <NavLink to="/settings" className={navItemClassName}>
          <SettingsIcon className="h-5 w-5 shrink-0" />
          Settings
        </NavLink>
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-control border-l-2 border-transparent px-3 py-2 text-left text-sm font-medium text-muted hover:bg-border/50"
        >
          <LogoutIcon className="h-5 w-5 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  )
}
