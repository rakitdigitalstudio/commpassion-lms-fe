import { useState } from 'react'

import { PlayIcon } from '@/components/icons'

interface LessonVideoPlayerProps {
  youtubeVideoId: string
  posterSrc: string
  posterAlt: string
}

/**
 * Poster + play overlay that swaps to an embedded YouTube player on click
 * (Ticket #24's "Embedded YouTube unlisted video player"). Re-mounts on
 * `youtubeVideoId` change so switching lessons always starts back at the
 * poster instead of leaving a stale iframe playing.
 */
export function LessonVideoPlayer({ youtubeVideoId, posterSrc, posterAlt }: LessonVideoPlayerProps) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <iframe
        key={youtubeVideoId}
        className="aspect-video w-full rounded-2xl"
        src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
        title={posterAlt}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  return (
    <button
      key={youtubeVideoId}
      type="button"
      onClick={() => setPlaying(true)}
      // Matches the stub cover art's native 4:3 — unlike aspect-video, this
      // doesn't crop the banner's logo/caption text, and stays a fixed
      // framing regardless of viewport width (see CourseCoverImage).
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl"
    >
      <img src={posterSrc} alt={posterAlt} className="h-full w-full object-cover" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 transition-transform group-hover:scale-105">
          <PlayIcon className="h-8 w-8 text-foreground" />
        </span>
      </span>
    </button>
  )
}
