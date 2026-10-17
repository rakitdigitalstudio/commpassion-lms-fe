import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { Breadcrumb } from '@/components/Breadcrumb'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { CourseModuleItem } from '@/components/CourseModuleItem'
import { EmptyState } from '@/components/EmptyState'
import { FullPageLoader } from '@/components/FullPageLoader'
import { LockIcon, PlusIcon } from '@/components/icons'
import { LessonVideoPlayer } from '@/components/LessonVideoPlayer'
import { Progress } from '@/components/Progress'
import { useGetCourseDetailQuery } from '@/hooks/useGetCourseDetailQuery'
import { useLessons, useMarkLessonComplete } from '@/hooks/useLessons'

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>()
  const { t } = useTranslation()

  const courseQuery = useGetCourseDetailQuery(courseId ?? '')
  const lessonsQuery = useLessons(courseId ?? '')
  const markComplete = useMarkLessonComplete(courseId ?? '')

  const lessons = lessonsQuery.data ?? []
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)

  // Defaults to the first incomplete lesson (or the first lesson if
  // everything's done) until the learner picks one explicitly — computed
  // at render instead of synced via an effect, since it's derived from
  // `lessons`, not independent state.
  const defaultLessonId = (lessons.find((lesson) => !lesson.completed) ?? lessons[0])?.id ?? null
  const effectiveLessonId = selectedLessonId ?? defaultLessonId

  if (courseQuery.isLoading || !courseId) {
    return <FullPageLoader />
  }

  if (courseQuery.isError || !courseQuery.data) {
    return (
      <EmptyState
        icon={
          <span className="flex items-center justify-center rounded-full bg-warning/25 p-5">
            <LockIcon className="h-10 w-10 text-warning" />
          </span>
        }
        heading={t('courseDetail.accessDeniedHeading')}
        subtext={t('courseDetail.accessDeniedSubtext')}
        cta={
          <Link to="/purchases">
            <Button variant="primary" className="text-xs">
              {t('courseDetail.backToPurchases')}
            </Button>
          </Link>
        }
      />
    )
  }

  const course = courseQuery.data

  if (!course.enrolled) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumb
          items={[
            { label: t('courseDetail.breadcrumbRoot'), to: '/purchases' },
            { label: course.title },
          ]}
        />
        <EmptyState
          icon={
            <span className="flex items-center justify-center rounded-full bg-warning/25 p-5">
              <LockIcon className="h-10 w-10 text-warning" />
            </span>
          }
          heading={t('courseDetail.accessDeniedHeading')}
          subtext={t('courseDetail.accessDeniedSubtext')}
          cta={
            <Link to="/purchases">
              <Button variant="primary" className="text-xs">
                {t('courseDetail.backToPurchases')}
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  const selectedLesson = lessons.find((lesson) => lesson.id === effectiveLessonId)
  const completedCount = lessons.filter((lesson) => lesson.completed).length
  const progressPercent = lessons.length === 0 ? 0 : Math.round((completedCount / lessons.length) * 100)

  const handleMarkAsDone = () => {
    if (!selectedLesson) return

    markComplete.mutate(selectedLesson.id, {
      onSuccess: (updatedLessons) => {
        const next = updatedLessons.find((lesson) => !lesson.completed)
        if (next) setSelectedLessonId(next.id)
      },
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-6">
        <Breadcrumb
          items={[
            { label: t('courseDetail.breadcrumbRoot'), to: '/purchases' },
            { label: course.title },
          ]}
        />
        <Link to="/explore">
          <Button variant="primary" className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            {t('courseDetail.browseMore')}
          </Button>
        </Link>
      </div>

      <Card>
        <h1 className="text-h2 font-medium">{course.title}</h1>
        <p className="text-muted">{t('courseDetail.byInstructor', { name: course.instructorName })}</p>
      </Card>

      <div className="flex items-stretch gap-6">
        <div className="flex flex-1 flex-col gap-5">
          {selectedLesson ? (
            <LessonVideoPlayer
              youtubeVideoId={selectedLesson.youtubeVideoId}
              posterSrc={course.imageSrc}
              posterAlt={selectedLesson.title}
            />
          ) : null}

          {selectedLesson ? (
            <Card className="flex items-center justify-between gap-6">
              <div>
                <h2 className="text-h3 font-semibold">{selectedLesson.title}</h2>
                <p className="text-sm">{selectedLesson.subtitle}</p>
                <p className="mt-2 text-sm text-muted">
                  {t('courseDetail.videoDuration')} <strong>{selectedLesson.durationLabel}</strong>
                </p>
              </div>
              <Button
                variant="accent"
                disabled={selectedLesson.completed || markComplete.isPending}
                onClick={handleMarkAsDone}
              >
                {markComplete.isPending
                  ? t('courseDetail.markingAsDone')
                  : t('courseDetail.markAsDone')}
              </Button>
            </Card>
          ) : null}
        </div>

        <Card className="flex w-[348px] shrink-0 flex-col">
          <div className="shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-h3 font-semibold">{t('courseDetail.learningProgress')}</h2>
              <span className="text-sm text-muted">
                {t('courseDetail.doneCount', { completed: completedCount, total: lessons.length })}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Progress value={progressPercent} className="flex-1" />
              <span className="text-sm font-semibold">{progressPercent}%</span>
            </div>
            <hr className="my-4 border-border" />
          </div>
          {/* Only this list scrolls — the card stretches to match the left
              column's height (see the row's items-stretch) instead of
              growing past it and scrolling the whole page. */}
          <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
            {lessons.map((lesson) => (
              <CourseModuleItem
                key={lesson.id}
                title={lesson.title}
                subtitle={lesson.subtitle}
                completed={lesson.completed}
                active={lesson.id === selectedLesson?.id}
                onClick={() => setSelectedLessonId(lesson.id)}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
