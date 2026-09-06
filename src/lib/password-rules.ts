/**
 * Password rules matching the Settings > Security tab mockup (Image 5's
 * "New Password" bullet list) — the one concrete, screenshot-confirmed
 * source for these, reused here since Ticket #11 has no design of its own
 * ("matches Image 8's rules").
 */
export interface PasswordRule {
  id: string
  /** English fallback — ResetPassword (not translated yet, see TODO.md)
   * still reads this directly; Register uses `labelKey` via t() instead. */
  label: string
  /** i18n key, e.g. t(rule.labelKey) -> "At least 8 characters" / "Minimal 8 karakter". */
  labelKey: string
  test: (password: string) => boolean
}

export const passwordRules: PasswordRule[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    labelKey: 'auth.passwordRules.length',
    test: (password) => password.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    labelKey: 'auth.passwordRules.uppercase',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: 'number',
    label: 'One number',
    labelKey: 'auth.passwordRules.number',
    test: (password) => /[0-9]/.test(password),
  },
  {
    id: 'special',
    label: 'One special character',
    labelKey: 'auth.passwordRules.special',
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
]

export function isPasswordValid(password: string): boolean {
  return passwordRules.every((rule) => rule.test(password))
}
