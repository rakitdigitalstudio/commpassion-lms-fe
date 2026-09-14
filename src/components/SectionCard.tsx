import type { ReactNode } from 'react'

import { Card } from '@/components/Card'

interface SectionCardProps {
  title: string
  /** Right-aligned header action, e.g. a "View All" link/button. */
  action?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * White panel with a title row, a divider, and content — the shape shared
 * by Dashboard's "Learning Progress", "Recent Activity", "Course Progress"
 * (empty state), and the Introduction Video card.
 */
export function SectionCard({ title, action, children, className = '' }: SectionCardProps) {
  return (
    <Card className={`flex flex-col gap-5 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-medium">{title}</h3>
        {action}
      </div>
      <hr className="border-border" />
      {children}
    </Card>
  )
}
