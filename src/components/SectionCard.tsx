import type { ReactNode } from 'react'

import { Card } from '@/components/Card'

interface SectionCardProps {
  title: string
  /** Second header line under the title, e.g. Settings' "This information may be visible to..." */
  subtitle?: string
  /** Right-aligned header action, e.g. a "View All" link/button. */
  action?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * White panel with a title row, a divider, and content — the shape shared
 * by Dashboard's "Learning Progress", "Recent Activity", "Course Progress"
 * (empty state), the Introduction Video card, and Settings' form panels.
 */
export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className = '',
}: SectionCardProps) {
  return (
    <Card className={`flex flex-col gap-5 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-h3 font-medium">{title}</h3>
          {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <hr className="border-border" />
      {children}
    </Card>
  )
}
