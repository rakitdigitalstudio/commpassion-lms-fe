/**
 * Universal progress bar. Track and fill colors are plain CSS color
 * strings (not Tailwind classes) so exact Figma values — including
 * alpha, e.g. `#D9D9D980` — can be passed through without inventing a
 * token per usage. `ProgressBar` (status-based) wraps this.
 */
interface ProgressProps {
  /** 0-100 */
  value: number
  /** Defaults to the Figma spec: #D9D9D9 at 50% opacity. */
  trackColor?: string
  /** Defaults to the Figma spec: #84C6DA (== --color-primary). */
  color?: string
  className?: string
}

export function Progress({
  value,
  trackColor = '#D9D9D980',
  color = '#84C6DA',
  className = '',
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full ${className}`}
      style={{ backgroundColor: trackColor }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  )
}
