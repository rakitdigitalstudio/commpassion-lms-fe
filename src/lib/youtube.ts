const IFRAME_API_SRC = 'https://www.youtube.com/iframe_api'

export interface YoutubePlayer {
  getCurrentTime: () => number
  getDuration: () => number
  destroy: () => void
}

interface YoutubePlayerEvent {
  data: number
  target: YoutubePlayer
}

interface YoutubePlayerOptions {
  events: {
    onStateChange?: (event: YoutubePlayerEvent) => void
  }
}

interface YoutubeIframeApi {
  Player: new (element: HTMLIFrameElement, options: YoutubePlayerOptions) => YoutubePlayer
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number }
}

declare global {
  interface Window {
    YT?: YoutubeIframeApi
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<YoutubeIframeApi> | null = null

/**
 * Loads YouTube's IFrame Player API once and resolves `window.YT` — needed
 * to read playback progress (getCurrentTime/getDuration) off an embedded
 * lesson video for Ticket "auto-complete at ~90% watched", since a plain
 * `<iframe src="...">` exposes no playback state to the parent page.
 */
export function loadYoutubeIframeApi(): Promise<YoutubeIframeApi> {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT)
  }

  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const previousCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.()
        resolve(window.YT!)
      }

      if (!document.querySelector(`script[src="${IFRAME_API_SRC}"]`)) {
        const script = document.createElement('script')
        script.src = IFRAME_API_SRC
        document.head.appendChild(script)
      }
    })
  }

  return apiPromise
}
