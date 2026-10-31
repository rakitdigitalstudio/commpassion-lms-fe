interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  'aria-label'?: string
}

/** On/off toggle for a boolean preference — no Figma reference yet, built to match the app's rounded, border-light style. */
export function Switch({ checked, onChange, disabled = false, ...rest }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-primary' : 'bg-border'
      }`}
      {...rest}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow-card transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
