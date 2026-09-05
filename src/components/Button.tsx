import type { ButtonHTMLAttributes } from 'react'

/**
 * `success` isn't in Ticket #6's todo list (primary/accent/outline only)
 * but the Purchases mockup's "View Certificate" CTA is a distinct green
 * button — added to match the screenshot rather than force it into an
 * existing variant. Flagged in TODO.md.
 */
export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'success'

const variantClassName: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:opacity-90',
  accent: 'bg-accent text-foreground hover:opacity-90',
  success: 'bg-success text-white hover:opacity-90',
  outline: 'border border-primary text-primary hover:bg-primary/10',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-control px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClassName[variant]} ${className}`}
      {...props}
    />
  )
}
