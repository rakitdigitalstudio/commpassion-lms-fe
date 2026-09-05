const colorTokens = [
  { name: 'primary', className: 'bg-primary', hex: '#84c6da' },
  { name: 'accent', className: 'bg-accent', hex: '#faea05' },
  { name: 'success', className: 'bg-success', hex: '#22c55e' },
  { name: 'info', className: 'bg-info', hex: '#3b82f6' },
  { name: 'warning', className: 'bg-warning', hex: '#eab308' },
  { name: 'border', className: 'bg-border', hex: '#e5e7eb' },
  { name: 'muted', className: 'bg-muted', hex: '#6b7280' },
] as const

const typeScale = [
  { name: 'display', className: 'text-display font-bold', sample: 'Sign in to your account' },
  { name: 'h2', className: 'text-h2 font-semibold', sample: 'Welcome back, Marco!' },
  { name: 'h3', className: 'text-h3 font-semibold', sample: 'Learning Progress' },
  { name: 'stat', className: 'text-stat font-bold', sample: '40' },
  {
    name: 'base',
    className: 'text-base',
    sample: 'Here’s what’s happening with your learning today.',
  },
  { name: 'sm', className: 'text-sm text-muted', sample: '2h ago' },
] as const

export function StyleGuide() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 p-8">
      <header>
        <h1 className="text-display font-bold">Style Guide</h1>
        <p className="text-sm text-muted mt-1">
          Design tokens for colors and typography. `primary`/`accent` are pulled from Figma; the
          rest are eyeballed from mockups pending Figma Editor access — see README.
        </p>
      </header>

      <section>
        <h2 className="text-h2 font-semibold mb-4">Palette</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {colorTokens.map((token) => (
            <div
              key={token.name}
              className="rounded-card shadow-card overflow-hidden border border-border"
            >
              <div className={`h-16 ${token.className}`} />
              <div className="p-3">
                <p className="text-sm font-semibold">{token.name}</p>
                <p className="text-sm text-muted">{token.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-semibold mb-4">Type scale</h2>
        <div className="space-y-4">
          {typeScale.map((type) => (
            <div key={type.name} className="flex items-baseline gap-4 border-b border-border pb-4">
              <span className="w-16 shrink-0 text-sm text-muted">{type.name}</span>
              <p className={type.className}>{type.sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-semibold mb-4">Radius &amp; shadow</h2>
        <div className="flex gap-4">
          <div className="rounded-control bg-primary h-16 w-16" />
          <div className="rounded-card shadow-card bg-white border border-border h-16 w-32" />
        </div>
      </section>
    </div>
  )
}
