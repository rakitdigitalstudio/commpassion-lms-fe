import type { Status } from '@/components/StatusBadge'

interface CourseCardBase {
  slug: string
  title: string
  instructorName: string
  /** Tailwind background utility for the banner block, e.g. 'bg-indigo-600'. Real banner images aren't available yet — see TODO.md. */
  bannerClassName: string
}

export interface CatalogCourseCardProps extends CourseCardBase {
  variant: 'catalog'
  instructorRole: string
  /** IDR */
  price: number
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
