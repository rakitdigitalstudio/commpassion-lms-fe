export type Status = 'completed' | 'in-progress' | 'not-started'

// bg/text pairs match Figma exactly, including the in-progress badge's
// primary-tinted background paired with info-colored text.
const statusConfig: Record<Status, { label: string; className: string }> = {
  completed: { label: 'Completed', className: 'bg-success/25 text-success' },
  'in-progress': { label: 'In Progress', className: 'bg-primary/25 text-info' },
  'not-started': { label: 'Not Started', className: 'bg-warning/25 text-warning' },
}

interface StatusBadgeProps {
  status: Status
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  )
}
