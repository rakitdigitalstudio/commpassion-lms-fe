import type { InputHTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'

import { EyeIcon, EyeOffIcon, LockIcon } from '@/components/icons'
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility'

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

/**
 * Labeled password input with a lock icon + show/hide toggle — the
 * Settings > Security shape (Login/Register/ResetPassword each still
 * hand-roll their own copy of this; not touched here to keep this
 * ticket's diff scoped to Settings).
 */
export function PasswordField({ label, className = '', ...props }: PasswordFieldProps) {
  const { t } = useTranslation()
  const visibility = usePasswordVisibility()

  return (
    <div className="flex w-full items-center gap-3">
      <label className="w-[168px] shrink-0 text-sm font-medium">{label}</label>
      <div className="relative flex-1">
        <LockIcon className="text-muted-2 pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          type={visibility.inputType}
          className={`h-10 w-full rounded-control border border-muted-2 py-2 pr-9 pl-9 text-sm placeholder:text-muted-2 focus:ring-2 focus:ring-primary/40 focus:outline-none ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={visibility.toggle}
          aria-label={t(
            visibility.isVisible ? 'auth.passwordToggle.hide' : 'auth.passwordToggle.show',
          )}
          className="text-muted-2 absolute top-1/2 right-3 -translate-y-1/2"
        >
          {visibility.isVisible ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}
