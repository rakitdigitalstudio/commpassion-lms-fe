import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Not VITE_-prefixed on purpose: it's dev-server-only and never reaches
  // the client bundle. See README "Pointing local dev at a real API".
  const { DEV_API_PROXY_TARGET } = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: DEV_API_PROXY_TARGET
      ? {
          // The Golang API's session/CSRF cookies are SameSite=Strict, so
          // the browser must see API calls as same-origin: it calls
          // localhost/api/v1/* (VITE_API_URL empty) and Vite forwards them.
          proxy: {
            '/api/v1': { target: DEV_API_PROXY_TARGET, changeOrigin: true, secure: true },
          },
        }
      : undefined,
  }
})
