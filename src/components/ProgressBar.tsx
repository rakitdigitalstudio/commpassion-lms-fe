import { Progress } from '@/components/Progress'
import type { Status } from '@/components/StatusBadge'

const fillColor: Record<Status, string> = {
  completed: 'var(--color-success)',
  'in-progress': 'var(--color-info)',
  'not-started': 'var(--color-warning)',
}

interface ProgressBarProps {
  /** 0-100 */
  value: number
  status: Status
}

/** Status-colored wrapper around the universal Progress component. */
export function ProgressBar({ value, status }: ProgressBarProps) {
  return <Progress value={value} color={fillColor[status]} />
}
