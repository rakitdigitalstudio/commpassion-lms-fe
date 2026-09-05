import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  heading: string
  subtext: string
  /** Pass a <Button> (or <Link>) — the CTA's own styling stays with the caller. */
  cta?: ReactNode
}

export function EmptyState({ icon, heading, subtext, cta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border p-12 text-center">
      <div className="text-4xl text-muted" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-h3 font-semibold">{heading}</h3>
      <p className="max-w-sm text-sm text-muted">{subtext}</p>
      {cta}
    </div>
  )
}
