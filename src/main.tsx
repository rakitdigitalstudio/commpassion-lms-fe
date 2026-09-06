import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/App.tsx'
import '@/lib/i18n'
import { enableMocks } from '@/mocks/enable-mocks'

import './index.css'

await enableMocks()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
