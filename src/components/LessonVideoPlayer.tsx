import { useState } from 'react'

import { PlayIcon } from '@/components/icons'

interface LessonVideoPlayerProps {
  /** Lesson `video_url` — undefined while it's still loading (play is disabled until then). */
  videoUrl?: string
  /** Optional — Strapi courses can have no cover image. */
  posterSrc?: string
  posterAlt: string
}

/** YouTube watch/short/embed URL → video id; null for any other host. */
function getYoutubeVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  )

  return match ? match[1] : null
}

/**
 * Poster + play overlay that swaps to the lesson's video on click.
 * `video_url` is whatever the backoffice stores: YouTube links are
 * embedded, anything else (e.g. an .mp4 on the CDN) plays in a native
 * <video>. Re-mounts on `videoUrl` change so switching lessons always
 * starts back at the poster instead of leaving the old video playing.
 */
export function LessonVideoPlayer({ videoUrl, posterSrc, posterAlt }: LessonVideoPlayerProps) {
  const [playing, setPlaying] = useState(false)

  if (playing && videoUrl) {
    const youtubeVideoId = getYoutubeVideoId(videoUrl)

    return youtubeVideoId ? (
      <iframe
        key={videoUrl}
        className="aspect-video w-full rounded-2xl"
        src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
        title={posterAlt}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    ) : (
      <video
        key={videoUrl}
        className="aspect-video w-full rounded-2xl bg-black"
        src={videoUrl}
        title={posterAlt}
        controls
        autoPlay
      />
    )
  }

  return (
    <button
      key={videoUrl}
      type="button"
      onClick={() => setPlaying(true)}
      disabled={!videoUrl}
      // Matches the cover art's native 4:3 — unlike aspect-video, this
      // doesn't crop the banner's logo/caption text, and stays a fixed
      // framing regardless of viewport width (see CourseCoverImage).
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted/20"
    >
      {posterSrc && <img src={posterSrc} alt={posterAlt} className="h-full w-full object-cover" />}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 transition-transform group-hover:scale-105">
          <PlayIcon className="h-8 w-8 text-foreground" />
        </span>
      </span>
    </button>
  )
}
