import { USE_MOCKS } from '@/lib/config'

/**
 * Starts the MSW browser worker when VITE_USE_MOCKS=true (see
 * .env.example / README "Mocking (MSW)"). Resolves immediately as a no-op
 * when mocks are off, so callers can always `await` it before rendering.
 */
export async function enableMocks(): Promise<void> {
  if (!USE_MOCKS) {
    return
  }

  const { worker } = await import('@/mocks/browser')

  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}
