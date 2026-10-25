import { useTranslation } from 'react-i18next'

import { ChevronLeftIcon } from '@/components/icons'

interface PaginationProps {
  /** 1-based. */
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

type PageItem = number | 'gap'

/** First, last, and the current page ± 1, with gaps between — e.g. 1 … 4 5 6 … 12. */
function getPageItems(page: number, pageCount: number): PageItem[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1])
  const sorted = [...pages]
    .filter((value) => value >= 1 && value <= pageCount)
    .sort((a, b) => a - b)

  return sorted.flatMap((value, index) =>
    index > 0 && value - sorted[index - 1] > 1 ? (['gap', value] as PageItem[]) : [value],
  )
}

const buttonClassName =
  'flex h-9 min-w-9 items-center justify-center rounded-control border border-border px-3 text-sm disabled:opacity-40'

/** Previous / numbered pages / next. Renders nothing for a single page. */
export function Pagination({ page, pageCount, onPageChange, disabled = false }: PaginationProps) {
  const { t } = useTranslation()

  if (pageCount <= 1) {
    return null
  }

  return (
    <nav
      aria-label={t('common.pagination.label')}
      className="flex items-center justify-center gap-2"
    >
      <button
        type="button"
        className={buttonClassName}
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
        aria-label={t('common.pagination.previous')}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>

      {getPageItems(page, pageCount).map((item, index) =>
        item === 'gap' ? (
          <span key={`gap-${index}`} className="px-1 text-muted">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`${buttonClassName} ${item === page ? 'border-primary bg-primary/25 font-semibold' : ''}`}
            onClick={() => onPageChange(item)}
            disabled={disabled}
            aria-current={item === page ? 'page' : undefined}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={buttonClassName}
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= pageCount}
        aria-label={t('common.pagination.next')}
      >
        <ChevronLeftIcon className="h-4 w-4 rotate-180" />
      </button>
    </nav>
  )
}
