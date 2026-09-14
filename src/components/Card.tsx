import type { HTMLAttributes } from 'react'

/**
 * Base panel primitive shared by every card-shaped surface (StatCard,
 * SectionCard, CourseCard). Centralizes the rounded/shadow/border/bg
 * treatment so it stays in sync across all of them.
 */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Set false to omit the default padding (e.g. when a child owns its own, like an image banner). */
  padded?: boolean
}

export function Card({ padded = true, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-card shadow-card border border-border bg-background ${padded ? 'p-5' : ''} ${className}`}
      {...props}
    />
  )
}
