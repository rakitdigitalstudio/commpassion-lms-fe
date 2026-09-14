interface FilterChipProps {
  label: string
  count: number
  active?: boolean
  onClick?: () => void
}

/** Pill + rounded count badge, e.g. My Purchases' "All Courses 8" / "In Progress 6" filters. */
export function FilterChip({ label, count, active = false, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-control px-4 py-2 text-sm font-medium ${
        active ? 'bg-primary/25 text-info' : 'border border-border bg-background text-foreground'
      }`}
    >
      {label}
      <span
        className={`flex w-7 items-center justify-center rounded-full px-2 py-1 text-sm ${
          active ? 'bg-primary text-white' : 'bg-border/50 text-muted'
        }`}
      >
        {count}
      </span>
    </button>
  )
}
