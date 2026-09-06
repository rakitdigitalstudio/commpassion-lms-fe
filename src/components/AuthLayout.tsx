import type { ReactNode } from 'react'

/**
 * Two-column layout shared by Login, Register, and Forgot Password.
 * Proportions translated manually from Figma (no Figma access this
 * session — verify against the real file, see TODO.md):
 *
 *   Design width: 1440px
 *   Left box:      511px
 *   Gap:           112px
 *   Right box:     645px
 *   ------------------------
 *   511 + 112 + 645 = 1268px content width
 *   1440 - 1268 = 172px left over -> assumed to be 86px outer margin on
 *   each side (not confirmed against Figma)
 *
 * Expressed as percentages (not fixed px) so the layout stays in the same
 * proportions at any viewport width, not just exactly 1440px:
 *   - outer padding: 86 / 1440  = 5.972%
 *   - column ratio:  511fr / 645fr (a CSS grid `fr` split already keeps
 *     that ratio regardless of the available width)
 *   - column gap:    112 / 1268 = 8.833% (percentage gap is resolved
 *     against the grid container's own content-box width)
 *
 * Below the `lg` breakpoint the two columns stack — there's no mockup
 * for a two-column layout on a narrow viewport, and Login/Register's
 * forms need the full width there to stay usable.
 */
export function AuthLayout({
  children,
  rightPanel,
}: {
  children: ReactNode
  rightPanel?: ReactNode
}) {
  return (
    <div className="min-h-screen px-[5.972%] py-10 lg:py-16">
      <div className="mx-auto grid max-w-[1268px] grid-cols-1 items-center gap-10 lg:grid-cols-[511fr_645fr] lg:gap-x-[8.833%] lg:gap-y-0">
        <div>{children}</div>
        {rightPanel}
      </div>
    </div>
  )
}
