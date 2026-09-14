import { Button, type ButtonVariant } from '@/components/Button'
import { Card } from '@/components/Card'
import { CourseCoverImage, CourseProgressRow, CourseStatsRow } from '@/components/CourseCardParts'
import type { CourseCardProps } from '@/components/CourseCard.types'
import { RatingBadge } from '@/components/RatingBadge'
import type { Status } from '@/components/StatusBadge'

const ctaVariantByStatus: Record<Status, ButtonVariant> = {
  'in-progress': 'primary',
  completed: 'success',
  'not-started': 'accent',
}

function formatIdr(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

/**
 * Composes the atoms in CourseCardParts.tsx rather than branching inside
 * one big block, so a future card layout can reuse just the pieces it
 * needs. Public props (the `CourseCardProps` discriminated union) are
 * unchanged from before this refactor — see StyleGuide.tsx.
 */
export function CourseCard(props: CourseCardProps) {
  return (
    <Card padded={false} className="overflow-hidden">
      <CourseCoverImage
        title={props.title}
        instructorName={props.instructorName}
        imageSrc={props.imageSrc}
        bannerClassName={props.bannerClassName}
      />

      <div className="flex flex-col gap-5 p-5">
        <div className="flex flex-col gap-2">
          <p className="text-h3 font-medium">{props.title}</p>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="flex-1">By {props.instructorName}</span>
            {props.variant === 'catalog' && props.rating !== undefined ? (
              <RatingBadge rating={props.rating} reviewCount={props.reviewCount ?? 0} />
            ) : null}
          </div>
        </div>

        {props.variant === 'catalog' ? (
          <>
            {props.moduleCount !== undefined &&
            props.completedModules !== undefined &&
            props.durationLabel ? (
              <CourseStatsRow
                moduleCount={props.moduleCount}
                completedModules={props.completedModules}
                durationLabel={props.durationLabel}
              />
            ) : null}
            <div className="flex items-center gap-3">
              <p className="flex-1 font-bold">{formatIdr(props.price)}</p>
              <Button variant="accent" className="w-[120px]">
                Buy Now
              </Button>
            </div>
          </>
        ) : (
          <>
            <CourseStatsRow
              moduleCount={props.moduleCount}
              completedModules={props.completedModules}
              durationLabel={props.durationLabel}
            />
            <CourseProgressRow status={props.status} progress={props.progress} />
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
    </Card>
  )
}
