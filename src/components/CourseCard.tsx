import { Button, type ButtonVariant } from '@/components/Button'
import type { CourseCardProps } from '@/components/CourseCard.types'
import { ProgressBar } from '@/components/ProgressBar'
import type { Status } from '@/components/StatusBadge'
import { StatusBadge } from '@/components/StatusBadge'

const ctaVariantByStatus: Record<Status, ButtonVariant> = {
  'in-progress': 'primary',
  completed: 'success',
  'not-started': 'accent',
}

function formatIdr(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

/**
 * `catalog` variant is inferred, not pixel-matched to a mockup — none of
 * the provided screenshots show the public catalog card. Ticket #21
 * ("Course card — catalog variant") should refine it. `purchased` matches
 * the My Purchases mockup.
 */
export function CourseCard(props: CourseCardProps) {
  return (
    <div className="overflow-hidden rounded-card shadow-card border border-border bg-background">
      <div className={`flex h-40 flex-col justify-end p-4 text-white ${props.bannerClassName}`}>
        <p className="text-h3 font-bold">{props.title}</p>
        <p className="text-sm opacity-90">{props.instructorName}</p>
      </div>

      <div className="space-y-3 p-4">
        <p className="text-h3 font-semibold">{props.title}</p>
        <p className="text-sm text-muted">By {props.instructorName}</p>

        {props.variant === 'catalog' ? (
          <>
            <p className="text-sm text-muted">{props.instructorRole}</p>
            <p className="font-semibold">{formatIdr(props.price)}</p>
            <Button variant="primary" className="w-full">
              View Course
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm text-muted">
              <span>
                {props.completedModules}/{props.moduleCount} Module Videos
              </span>
              <span>{props.durationLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <StatusBadge status={props.status} />
              <span className="text-sm font-semibold">{props.progress}%</span>
            </div>
            <ProgressBar value={props.progress} status={props.status} />
            <Button
              variant={ctaVariantByStatus[props.status]}
              className="w-full"
              onClick={props.onCtaClick}
            >
              {props.ctaLabel}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
