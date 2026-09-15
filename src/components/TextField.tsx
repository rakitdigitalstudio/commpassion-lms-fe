import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  /** Second line under the label, e.g. Settings' "Used for login." */
  hint?: string
}

/** Fixed-width label (+ optional hint) beside an input — Settings' form-row shape. */
export function TextField({ label, hint, className = '', ...props }: TextFieldProps) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="w-[168px] shrink-0">
        <p className="text-sm font-medium">{label}</p>
        {hint ? <p className="text-sm text-muted">{hint}</p> : null}
      </div>
      <input
        className={`h-10 flex-1 rounded-control border border-muted-2 px-4 py-2 text-sm placeholder:text-muted-2 focus:ring-2 focus:ring-primary/40 focus:outline-none ${className}`}
        {...props}
      />
    </div>
  )
}
