interface ActivityItemProps {
  description: string
  timeAgo: string
  /** Dot color, e.g. 'var(--color-primary)'. */
  dotColor: string
}

/** Colored dot + description + relative timestamp — Dashboard's Recent Activity rows. */
export function ActivityItem({ description, timeAgo, dotColor }: ActivityItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2">
        <span
          className="mt-2 h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: dotColor }}
          aria-hidden="true"
        />
        <p className="text-sm font-medium">{description}</p>
      </div>
      <p className="pl-4 text-sm text-muted">{timeAgo}</p>
    </div>
  )
}
