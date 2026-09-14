import { StarIcon } from '@/components/icons'

interface RatingBadgeProps {
  rating: number
  reviewCount: number
}

/** Star icon + "4,9 (20 Reviews)" — used on catalog/explore course cards. */
export function RatingBadge({ rating, reviewCount }: RatingBadgeProps) {
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-muted">
      <StarIcon className="h-4 w-4 text-warning" />
      {rating.toFixed(1).replace('.', ',')} ({reviewCount} Reviews)
    </span>
  )
}
