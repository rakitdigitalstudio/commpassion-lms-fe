export type Status = 'completed' | 'in-progress' | 'not-started'

const statusConfig: Record<Status, { label: string; className: string }> = {
  completed: { label: 'Completed', className: 'bg-success/10 text-success' },
  'in-progress': { label: 'In Progress', className: 'bg-info/10 text-info' },
  'not-started': { label: 'Not Started', className: 'bg-warning/10 text-warning' },
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
