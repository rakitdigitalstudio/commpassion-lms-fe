import { useTranslation } from 'react-i18next'

import introVideoPoster from '@/assets/intro-video-poster.png'
import { Card } from '@/components/Card'
import { EyeOffIcon, SparklesIcon } from '@/components/icons'
import { LessonVideoPlayer } from '@/components/LessonVideoPlayer'
import { INTRO_VIDEO_URL } from '@/lib/config'

interface IntroductionVideoCardProps {
  /** Dismisses the card for good — flips is_new_user false server-side. */
  onHide: () => void
  isHiding?: boolean
}

/**
 * Shown on the Dashboard while user.isNewUser is true (Figma node
 * 676:6337). Unlike the Figma source's Show/Hide toggle — which keeps the
 * card around in a collapsed state — "Hide Video" here dismisses it for
 * good: the backend flag is one-directional (no "collapsed but still
 * new" state to persist), so re-showing a hidden card isn't something the
 * data model supports.
 */
export function IntroductionVideoCard({ onHide, isHiding = false }: IntroductionVideoCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-h3 font-medium">{t('dashboard.introVideo.title')}</h2>
            <span className="flex items-center gap-1 rounded-full bg-accent px-4 py-1 text-xs font-medium text-foreground">
              <SparklesIcon className="h-4 w-4" />
              {t('dashboard.introVideo.badge')}
            </span>
          </div>
          <p className="text-sm">{t('dashboard.introVideo.description')}</p>
        </div>

        <button
          type="button"
          onClick={onHide}
          disabled={isHiding}
          className="flex shrink-0 items-center gap-2 text-sm font-bold text-primary disabled:opacity-50"
        >
          <EyeOffIcon className="h-6 w-6" />
          {t('dashboard.introVideo.hide')}
        </button>
      </div>

      <hr className="border-border" />

      <LessonVideoPlayer
        videoUrl={INTRO_VIDEO_URL || undefined}
        posterSrc={introVideoPoster}
        posterAlt={t('dashboard.introVideo.title')}
      />
      {!INTRO_VIDEO_URL ? (
        <p className="text-center text-sm text-muted">{t('dashboard.introVideo.videoNotAvailable')}</p>
      ) : null}
    </Card>
  )
}
