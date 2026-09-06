/**
 * Password rules matching the Settings > Security tab mockup (Image 5's
 * "New Password" bullet list) — the one concrete, screenshot-confirmed
 * source for these, reused here since Ticket #11 has no design of its own
 * ("matches Image 8's rules").
 */
export interface PasswordRule {
  id: string
  label: string
  test: (password: string) => boolean
}

export const passwordRules: PasswordRule[] = [
  { id: 'length', label: 'At least 8 characters', test: (password) => password.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter', test: (password) => /[A-Z]/.test(password) },
  { id: 'number', label: 'One number', test: (password) => /[0-9]/.test(password) },
  {
    id: 'special',
    label: 'One special character',
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
]

export function isPasswordValid(password: string): boolean {
  return passwordRules.every((rule) => rule.test(password))
}
