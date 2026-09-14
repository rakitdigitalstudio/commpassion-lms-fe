import { ProgressBar } from '@/components/ProgressBar'
import type { Status } from '@/components/StatusBadge'
import { StatusBadge } from '@/components/StatusBadge'

/**
 * Composable pieces `CourseCard` builds itself from. Split out so future
 * card layouts (e.g. Ticket #21's catalog refinements) can recompose them
 * without duplicating markup.
 */

interface CourseCoverImageProps {
  title: string
  instructorName: string
  /** Real cover photo. Falls back to a colored gradient + title/instructor overlay when omitted. */
  imageSrc?: string
  /** Tailwind background utility for the gradient fallback, e.g. 'bg-indigo-600'. */
  bannerClassName?: string
}

export function CourseCoverImage({
  title,
  instructorName,
  imageSrc,
  bannerClassName,
}: CourseCoverImageProps) {
  if (imageSrc) {
    return <img src={imageSrc} alt={title} className="h-52 w-full rounded-t-card object-cover" />
  }

  return (
    <div
      className={`flex h-52 flex-col justify-end rounded-t-card p-4 text-white ${bannerClassName ?? 'bg-slate-700'}`}
    >
      <p className="text-h3 font-bold">{title}</p>
      <p className="text-sm opacity-90">{instructorName}</p>
    </div>
  )
}

interface CourseStatsRowProps {
  moduleCount: number
  completedModules: number
  durationLabel: string
}

export function CourseStatsRow({
  moduleCount,
  completedModules,
  durationLabel,
}: CourseStatsRowProps) {
  return (
    <>
      <hr className="w-full border-border" />
      <div className="flex w-full items-center justify-between text-sm text-muted">
        <span>
          {completedModules}/{moduleCount} Module Videos
        </span>
        <span>{durationLabel}</span>
      </div>
    </>
  )
}

interface CourseProgressRowProps {
  status: Status
  /** 0-100 */
  progress: number
}

export function CourseProgressRow({ status, progress }: CourseProgressRowProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <StatusBadge status={status} />
        <span className="text-sm font-bold">{progress}%</span>
      </div>
      <ProgressBar value={progress} status={status} />
    </div>
  )
}
