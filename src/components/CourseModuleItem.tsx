import { CheckCircleIcon, LockIcon, PlayIcon } from '@/components/icons'

interface CourseModuleItemProps {
  title: string
  subtitle?: string
  /** Whether this lesson has been marked done — drives the check-circle vs. play icon. */
  completed: boolean
  /** Whether this is the lesson currently loaded in the player — drives the highlight background. */
  active: boolean
  onClick?: () => void
  /** Course not purchased yet (Ticket #69) — shows a lock icon and isn't clickable. */
  locked?: boolean
}

/**
 * One row in a course's lesson/module list (right-hand "Learning Progress"
 * sidebar on the video page, Tickets #23/#24). Reusable wherever a
 * module/lesson needs to be listed — not tied to that page's layout.
 * `completed` (icon) and `active` (highlight) are independent: Figma shows
 * the currently-selected lesson highlighted regardless of its completion
 * state.
 */
export function CourseModuleItem({
  title,
  subtitle,
  completed,
  active,
  onClick,
  locked = false,
}: CourseModuleItemProps) {
  const content = (
    <>
      <span className="flex items-center gap-2 text-sm font-medium">
        {locked ? (
          <LockIcon className="h-5 w-5 shrink-0 text-muted" />
        ) : completed ? (
          <CheckCircleIcon className="h-6 w-6 shrink-0 text-success" />
        ) : (
          <PlayIcon className="h-6 w-6 shrink-0 text-muted" />
        )}
        {title}
      </span>
      {subtitle ? <span className="pl-8 text-xs text-muted">{subtitle}</span> : null}
    </>
  )

  if (locked) {
    return (
      <div className="flex w-full flex-col gap-1 rounded-control px-2 py-2 text-left text-muted">
        {content}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col gap-1 rounded-control px-2 py-2 text-left transition-colors ${
        active ? 'bg-primary/25' : 'hover:bg-border/50'
      }`}
    >
      {content}
    </button>
  )
}
