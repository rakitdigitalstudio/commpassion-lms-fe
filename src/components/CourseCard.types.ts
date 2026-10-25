import type { Status } from '@/components/StatusBadge'

interface CourseCardBase {
  courseId: string
  title: string
  instructorName: string
  /** Strapi cover photo. Falls back to `bannerClassName` when omitted. */
  imageSrc?: string
  /** Tailwind background utility for the gradient fallback banner, e.g. 'bg-indigo-600'. */
  bannerClassName?: string
}

export interface CatalogCourseCardProps extends CourseCardBase {
  variant: 'catalog'
  /** IDR */
  price: number
  onBuyClick?: () => void
}

export interface PurchasedCourseCardProps extends CourseCardBase {
  variant: 'purchased'
  completedModules: number
  moduleCount: number
  status: Status
  /** 0-100 */
  progress: number
  ctaLabel: string
  onCtaClick?: () => void
}

export type CourseCardProps = CatalogCourseCardProps | PurchasedCourseCardProps
