import { useEffect, useRef, useState } from 'react'

import { LockIcon, PlayIcon } from '@/components/icons'
import { loadYoutubeIframeApi, type YoutubePlayer } from '@/lib/youtube'

interface LessonVideoPlayerProps {
  /** Lesson `video_url` — undefined while it's still loading (play is disabled until then). */
  videoUrl?: string
  /** Optional — Strapi courses can have no cover image. */
  posterSrc?: string
  posterAlt: string
  /** Course not purchased yet (Ticket #69) — shows a lock icon instead of play and never plays. */
  locked?: boolean
  /** Fires once per video, when playback reaches ~90% watched (or ends) — see useMarkLessonCompleteMutation. */
  onNearlyFinished?: () => void
}

/** YouTube watch/short/embed URL → video id; null for any other host. */
function getYoutubeVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  )

  return match ? match[1] : null
}

const NEARLY_FINISHED_RATIO = 0.9

/**
 * Embedded YouTube player, wired to the IFrame Player API (not just a bare
 * `<iframe src>`) so we can read `getCurrentTime()`/`getDuration()` and fire
 * `onNearlyFinished` — a plain iframe exposes no playback state to the
 * parent page. One instance per video (the caller keys this by videoId), so
 * the "already fired" guard doesn't need to track video changes itself.
 */
function YoutubeLessonPlayer({
  videoId,
  title,
  onNearlyFinished,
}: {
  videoId: string
  title: string
  onNearlyFinished?: () => void
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const onNearlyFinishedRef = useRef(onNearlyFinished)

  useEffect(() => {
    onNearlyFinishedRef.current = onNearlyFinished
  }, [onNearlyFinished])

  useEffect(() => {
    let cancelled = false
    let player: YoutubePlayer | null = null
    let intervalId: ReturnType<typeof setInterval> | null = null
    let fired = false

    const stopPolling = () => {
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    const fireOnce = () => {
      if (fired) return
      fired = true
      stopPolling()
      onNearlyFinishedRef.current?.()
    }

    void loadYoutubeIframeApi().then((YT) => {
      if (cancelled || !iframeRef.current) return

      player = new YT.Player(iframeRef.current, {
        events: {
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.ENDED) {
              fireOnce()
              return
            }
            if (event.data === YT.PlayerState.PLAYING) {
              stopPolling()
              intervalId = setInterval(() => {
                const duration = player?.getDuration() ?? 0
                const currentTime = player?.getCurrentTime() ?? 0
                if (duration > 0 && currentTime / duration >= NEARLY_FINISHED_RATIO) {
                  fireOnce()
                }
              }, 2000)
            } else {
              stopPolling()
            }
          },
        },
      })
    })

    return () => {
      cancelled = true
      stopPolling()
      player?.destroy()
    }
  }, [])

  return (
    <iframe
      ref={iframeRef}
      className="aspect-video w-full rounded-2xl"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=${window.location.origin}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}

/**
 * Native `<video>` wrapped so its "already fired" guard lives per video
 * instance (the caller keys this by videoUrl) instead of needing to track
 * url changes itself — onTimeUpdate fires continuously, so without a guard
 * crossing 90% would call onNearlyFinished on every tick, not once.
 */
function NativeLessonVideoPlayer({
  videoUrl,
  title,
  onNearlyFinished,
}: {
  videoUrl: string
  title: string
  onNearlyFinished?: () => void
}) {
  const firedRef = useRef(false)

  const fireOnce = () => {
    if (firedRef.current) return
    firedRef.current = true
    onNearlyFinished?.()
  }

  return (
    <video
      className="aspect-video w-full rounded-2xl bg-black"
      src={videoUrl}
      title={title}
      controls
      autoPlay
      onTimeUpdate={(event) => {
        const el = event.currentTarget
        if (el.duration > 0 && el.currentTime / el.duration >= NEARLY_FINISHED_RATIO) {
          fireOnce()
        }
      }}
      onEnded={fireOnce}
    />
  )
}

/**
 * Poster + play overlay that swaps to the lesson's video on click.
 * `video_url` is whatever the backoffice stores: YouTube links are
 * embedded, anything else (e.g. an .mp4 on the CDN) plays in a native
 * <video>. Re-mounts on `videoUrl` change so switching lessons always
 * starts back at the poster instead of leaving the old video playing.
 */
export function LessonVideoPlayer({
  videoUrl,
  posterSrc,
  posterAlt,
  locked = false,
  onNearlyFinished,
}: LessonVideoPlayerProps) {
  const [playing, setPlaying] = useState(false)

  if (playing && videoUrl && !locked) {
    const youtubeVideoId = getYoutubeVideoId(videoUrl)

    return youtubeVideoId ? (
      <YoutubeLessonPlayer
        key={videoUrl}
        videoId={youtubeVideoId}
        title={posterAlt}
        onNearlyFinished={onNearlyFinished}
      />
    ) : (
      <NativeLessonVideoPlayer
        key={videoUrl}
        videoUrl={videoUrl}
        title={posterAlt}
        onNearlyFinished={onNearlyFinished}
      />
    )
  }

  return (
    <button
      key={videoUrl}
      type="button"
      onClick={() => setPlaying(true)}
      disabled={!videoUrl || locked}
      // Matches the cover art's native 4:3 — unlike aspect-video, this
      // doesn't crop the banner's logo/caption text, and stays a fixed
      // framing regardless of viewport width (see CourseCoverImage).
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted/20"
    >
      {posterSrc && <img src={posterSrc} alt={posterAlt} className="h-full w-full object-cover" />}
      {locked ? <span className="absolute inset-0 bg-black/40" /> : null}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 transition-transform group-hover:scale-105">
          {locked ? (
            <LockIcon className="h-8 w-8 text-foreground" />
          ) : (
            <PlayIcon className="h-8 w-8 text-foreground" />
          )}
        </span>
      </span>
    </button>
  )
}
