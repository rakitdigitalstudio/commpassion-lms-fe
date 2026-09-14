import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle: string
  /** Right-aligned CTA, e.g. "Browse More Courses". */
  action?: ReactNode
}

/** Title + subtitle + optional CTA — the header shape shared by Dashboard, My Purchases, and Explore. */
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <h1 className="text-h2 font-medium">{title}</h1>
        <p className="text-muted">{subtitle}</p>
      </div>
      {action}
    </div>
  )
}
