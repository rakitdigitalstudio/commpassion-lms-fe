import { useState } from 'react'

import { Card } from '@/components/Card'
import { EyeIcon, EyeOffIcon, SparklesIcon } from '@/components/icons'

interface IntroductionVideoCardProps {
  videoSrc: string
  posterSrc: string
  /** New User dashboard: true (autoplays, muted, on mount). Existing User: false (toggled open manually). */
  defaultOpen?: boolean
}

/**
 * Dashboard's "Introduction Video" panel. Same component for both
 * dashboard states — only `defaultOpen` differs (see Dashboard.tsx). The
 * video itself is a stubbed placeholder clip — see STUBBED_DATA.md.
 */
export function IntroductionVideoCard({
  videoSrc,
  posterSrc,
  defaultOpen = false,
}: IntroductionVideoCardProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-h3 font-medium">Introduction Video</h3>
            <span className="flex items-center gap-1 rounded-full bg-accent px-4 py-1 text-xs font-medium">
              <SparklesIcon className="h-4 w-4" />
              Recommended for New Learners
            </span>
          </div>
          <p className="text-sm">
            Get direct guidance on interactive learning, and a warm welcome from our professional
            instructors.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex shrink-0 items-center gap-2 text-sm font-bold text-primary"
        >
          {open ? <EyeOffIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
          {open ? 'Hide Video' : 'Show Video'}
        </button>
      </div>

      {open ? (
        <>
          <hr className="border-border" />
          <video
            key={videoSrc}
            src={videoSrc}
            poster={posterSrc}
            autoPlay={defaultOpen}
            muted
            loop
            controls
            playsInline
            className="aspect-video w-full rounded-2xl object-cover"
          />
        </>
      ) : null}
    </Card>
  )
}
