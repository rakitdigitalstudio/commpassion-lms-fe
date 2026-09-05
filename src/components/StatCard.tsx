import type { ReactNode } from 'react'

export type StatCardColor = 'primary' | 'accent' | 'success' | 'highlight'

const valueClassName: Record<StatCardColor, string> = {
  primary: 'text-primary',
  accent: 'text-accent',
  success: 'text-success',
  highlight: 'text-highlight',
}

const iconClassName: Record<StatCardColor, string> = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  highlight: 'bg-highlight/10 text-highlight',
}

interface StatCardProps {
  label: string
  value: ReactNode
  color?: StatCardColor
  /** Helper text under the value, e.g. "+1 this month" (dashboard variant). */
  helperText?: string
  /** Icon in a colored square above the label (purchases-page variant). Omit for the plain dashboard style. */
  icon?: ReactNode
}

export function StatCard({ label, value, color = 'primary', helperText, icon }: StatCardProps) {
  return (
    <div className="rounded-card shadow-card border border-border bg-background p-6">
      {icon ? (
        <div
          className={`mb-3 flex h-10 w-10 items-center justify-center rounded-control ${iconClassName[color]}`}
        >
          {icon}
        </div>
      ) : null}
      <p className="text-sm text-muted">{label}</p>
      <p className={`text-stat font-bold ${valueClassName[color]}`}>{value}</p>
      {helperText ? <p className="mt-1 text-sm text-muted">{helperText}</p> : null}
    </div>
  )
}
