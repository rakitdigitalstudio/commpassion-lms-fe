import { Link } from 'react-router-dom'

import { ChevronLeftIcon } from '@/components/icons'

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

/** Chevron-separated breadcrumb trail — the last item is the current page (non-interactive). */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-medium">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {/* Figma uses the same chevron-left glyph as both the leading
                "back" indicator and every separator, not a right-pointing
                one between items. */}
            <ChevronLeftIcon className="h-5 w-5 text-muted" />
            {item.to && !isLast ? (
              <Link to={item.to} className="text-primary hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-foreground' : 'text-muted'}>{item.label}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
