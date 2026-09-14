import type { Status } from '@/components/StatusBadge'

interface CourseCardBase {
  slug: string
  title: string
  instructorName: string
  /** Real cover photo (preferred — see STUBBED_DATA.md). Falls back to `bannerClassName` when omitted. */
  imageSrc?: string
  /** Tailwind background utility for the gradient fallback banner, e.g. 'bg-indigo-600'. */
  bannerClassName?: string
}

export interface CatalogCourseCardProps extends CourseCardBase {
  variant: 'catalog'
  instructorRole?: string
  /** IDR */
  price: number
  moduleCount?: number
  completedModules?: number
  durationLabel?: string
  rating?: number
  reviewCount?: number
}

export interface PurchasedCourseCardProps extends CourseCardBase {
  variant: 'purchased'
  completedModules: number
  moduleCount: number
  durationLabel: string
  status: Status
  /** 0-100 */
  progress: number
  ctaLabel: string
  onCtaClick?: () => void
}

export type CourseCardProps = CatalogCourseCardProps | PurchasedCourseCardProps
