import type { Status } from '@/components/StatusBadge'

const fillClassName: Record<Status, string> = {
  completed: 'bg-success',
  'in-progress': 'bg-info',
  'not-started': 'bg-warning',
}

interface ProgressBarProps {
  /** 0-100 */
  value: number
  status: Status
}

export function ProgressBar({ value, status }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-border"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full ${fillClassName[status]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
