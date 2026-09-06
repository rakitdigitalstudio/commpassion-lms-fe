import { RouterProvider } from 'react-router-dom'

import { MAINTENANCE_MODE } from '@/lib/config'
import { Maintenance } from '@/pages/Maintenance'
import { AuthProvider } from '@/providers/AuthProvider'
import { QueryProvider } from '@/providers/QueryProvider'
import { router } from '@/routes'

function App() {
  // Checked before QueryProvider/AuthProvider/the router even mount, so
  // maintenance mode doesn't depend on — and isn't blocked by — auth or
  // API state. See README "Maintenance page".
  if (MAINTENANCE_MODE) {
    return <Maintenance />
  }

  return (
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryProvider>
  )
}

export default App
