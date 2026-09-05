/**
 * Starts the MSW browser worker when VITE_USE_MOCKS=true (see
 * .env.example / README "Mocking (MSW)"). Resolves immediately as a no-op
 * when mocks are off, so callers can always `await` it before rendering.
 */
export async function enableMocks(): Promise<void> {
  if (import.meta.env.VITE_USE_MOCKS !== 'true') {
    return
  }

  const { worker } = await import('@/mocks/browser')

  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}
