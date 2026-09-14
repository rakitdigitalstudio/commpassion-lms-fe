import type { ReactNode } from 'react'

import { Card } from '@/components/Card'

export type StatCardColor = 'primary' | 'accent' | 'success' | 'highlight' | 'warning'

const valueClassName: Record<StatCardColor, string> = {
  primary: 'text-primary',
  accent: 'text-accent',
  success: 'text-success',
  highlight: 'text-highlight',
  warning: 'text-warning',
}

const iconClassName: Record<StatCardColor, string> = {
  primary: 'bg-primary/25 text-primary',
  accent: 'bg-accent/25 text-accent',
  success: 'bg-success/25 text-success',
  highlight: 'bg-highlight/25 text-highlight',
  warning: 'bg-warning/25 text-warning',
}

interface StatCardProps {
  label: string
  value: ReactNode
  color?: StatCardColor
  /** Helper text under the value, e.g. "+1 this month" (dashboard variant). */
  helperText?: string
  /** Icon in a colored square above the label (purchases-page variant). Omit for the plain dashboard style. */
  icon?: ReactNode
  /** Renders the value in a flat gray regardless of `color` — the New User dashboard's all-0 zero-state (Figma: #c4bfbf). */
  muted?: boolean
  className?: string
}

export function StatCard({
  label,
  value,
  color = 'primary',
  helperText,
  icon,
  muted = false,
  className = '',
}: StatCardProps) {
  return (
    <Card className={className}>
      {icon ? (
        <div
          className={`mb-3 flex h-10 w-10 items-center justify-center rounded-control ${iconClassName[color]}`}
        >
          {icon}
        </div>
      ) : null}
      <p className="text-sm text-muted">{label}</p>
      <p className={`text-stat font-bold ${muted ? 'text-muted-2' : valueClassName[color]}`}>
        {value}
      </p>
      {helperText ? <p className="mt-1 text-sm text-muted">{helperText}</p> : null}
    </Card>
  )
}
