import { RouterProvider } from 'react-router-dom'

import { UserAuthenticationProvider } from '@/context/UserAuthenticationContext'
import { MAINTENANCE_MODE } from '@/lib/config'
import { Maintenance } from '@/pages/Maintenance'
import { QueryProvider } from '@/providers/QueryProvider'
import { router } from '@/routes'

function App() {
  // Checked before QueryProvider/UserAuthenticationProvider/the router even mount, so
  // maintenance mode doesn't depend on — and isn't blocked by — auth or
  // API state. See README "Maintenance page".
  if (MAINTENANCE_MODE) {
    return <Maintenance />
  }

  return (
    <QueryProvider>
      <UserAuthenticationProvider>
        <RouterProvider router={router} />
      </UserAuthenticationProvider>
    </QueryProvider>
  )
}

export default App
