import { Logo } from '@/components/Logo'

/**
 * Static page only — nothing routes here automatically yet. No ticket
 * specifies when/how maintenance mode should be triggered (a global env
 * flag redirecting every route here, a backend 503, etc.), so that wiring
 * isn't built. See TODO.md.
 */
export function Maintenance() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <Logo className="h-16 w-auto" />
      <h1 className="text-display font-bold">Under Maintenance</h1>
      <p className="text-muted max-w-md">
        We&apos;re making some improvements and will be back shortly. Thanks for your patience.
      </p>
    </div>
  )
}
