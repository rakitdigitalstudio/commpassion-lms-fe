import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { Breadcrumb } from '@/components/Breadcrumb'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { CourseModuleItem } from '@/components/CourseModuleItem'
import { EmptyState } from '@/components/EmptyState'
import { FullPageLoader } from '@/components/FullPageLoader'
import { LockIcon, PlusIcon } from '@/components/icons'
import { LessonVideoPlayer } from '@/components/LessonVideoPlayer'
import { Progress } from '@/components/Progress'
import { useGetCourseDetailQuery } from '@/api/courses/queries/useGetCourseDetailQuery'
import { useCheckoutMutation } from '@/api/courses/mutations/useCheckoutMutation'
import { CourseAlreadyEnrolledError, CourseUnpublishedError } from '@/api/courses/service/checkout'
import { queryKeys } from '@/api/core/query-keys'
import { useQueryCache } from '@/api/core/useQueryCache'
import { useMarkLessonCompleteMutation } from '@/api/lessons/mutations/useMarkLessonCompleteMutation'
import { useGetLessonPreviewsQuery } from '@/api/lessons/queries/useGetLessonPreviewsQuery'
import { useGetLessonVideoQuery } from '@/api/lessons/queries/useGetLessonVideoQuery'
import { useGetLessonsQuery } from '@/api/lessons/queries/useGetLessonsQuery'
import { formatIdr } from '@/lib/format-currency'
import { formatDuration } from '@/lib/format-time'
import { loadMidtransSnap, MidtransNotConfiguredError } from '@/lib/midtrans'

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>()
  const { t } = useTranslation()

  const courseQuery = useGetCourseDetailQuery(courseId ?? '')
  const courseLoaded = courseQuery.data !== undefined
  const enrolled = courseQuery.data?.enrolled === true
  // Lessons and videos are enrolled-only on the API, so don't ask before
  // enrollment is confirmed.
  const lessonsQuery = useGetLessonsQuery(courseId ?? '', { enabled: enrolled })
  // Not-enrolled preview (Ticket #69) reads lesson titles from Strapi only
  // (no per-user progress, which requires enrollment) — see
  // getLessonPreviews in lessons/service/lessons.ts.
  const previewLessonsQuery = useGetLessonPreviewsQuery(courseId ?? '', {
    enabled: courseLoaded && !enrolled,
  })
  const markComplete = useMarkLessonCompleteMutation(courseId ?? '')
  const checkoutMutation = useCheckoutMutation()
  const queryCache = useQueryCache()

  const lessons = lessonsQuery.data ?? []
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)

  // Defaults to the first incomplete lesson (or the first lesson if
  // everything's done) until the learner picks one explicitly — computed
  // at render instead of synced via an effect, since it's derived from
  // `lessons`, not independent state.
  const defaultLessonId = (lessons.find((lesson) => !lesson.completed) ?? lessons[0])?.id ?? null
  const effectiveLessonId = selectedLessonId ?? defaultLessonId
  const selectedLesson = lessons.find((lesson) => lesson.id === effectiveLessonId)

  const videoQuery = useGetLessonVideoQuery(courseId ?? '', selectedLesson?.index ?? 0, {
    enabled: selectedLesson !== undefined,
  })

  if (courseQuery.isLoading || lessonsQuery.isLoading || previewLessonsQuery.isLoading || !courseId) {
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

  // Enrollment is only final once the backend's Midtrans webhook lands
  // (TODO.md §5 `/api/v1/webhook/midtrans`), so onSuccess/onPending both
  // just ask the course + enrollment queries to refetch rather than
  // assuming success means enrolled yet.
  const refreshEnrollment = () => {
    void queryCache.invalidate(queryKeys.course(courseId ?? ''))
    void queryCache.invalidate(queryKeys.userCourses())
  }

  const handleBuyNow = () => {
    checkoutMutation.mutate(courseId ?? '', {
      onSuccess: async ({ snapToken }) => {
        try {
          const snap = await loadMidtransSnap()
          snap.pay(snapToken, {
            onSuccess: () => {
              toast.success(t('courseDetail.checkoutSuccess'))
              refreshEnrollment()
            },
            onPending: () => {
              toast.info(t('courseDetail.checkoutPending'))
              refreshEnrollment()
            },
            onError: () => {
              toast.error(t('courseDetail.checkoutError'))
            },
            onClose: () => {
              toast.info(t('courseDetail.checkoutClosed'))
            },
          })
        } catch (error) {
          toast.info(
            error instanceof MidtransNotConfiguredError
              ? t('courseDetail.checkoutNotConfigured')
              : t('courseDetail.checkoutError'),
          )
        }
      },
      onError: (error) => {
        if (error instanceof CourseAlreadyEnrolledError) {
          toast.info(t('courseDetail.checkoutAlreadyEnrolled'))
          refreshEnrollment()
          return
        }
        if (error instanceof CourseUnpublishedError) {
          toast.error(t('courseDetail.checkoutUnpublished'))
          return
        }
        toast.error(t('courseDetail.checkoutError'))
      },
    })
  }

  if (!course.enrolled) {
    const previewLessons = previewLessonsQuery.data ?? []

    return (
      <div className="flex flex-col gap-6">
        <Breadcrumb
          items={[
            { label: t('courseDetail.breadcrumbRoot'), to: '/purchases' },
            { label: course.title },
          ]}
        />

        <Card>
          <h1 className="text-h2 font-medium">{course.title}</h1>
          <p className="text-muted">{t('courseDetail.byInstructor', { name: course.instructorName })}</p>
        </Card>

        <div className="flex flex-col items-stretch gap-6 lg:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <LessonVideoPlayer posterSrc={course.imageSrc} posterAlt={course.title} locked />

            <Card className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p className="text-h3 font-semibold">{formatIdr(course.price)}</p>
              <Button
                variant="accent"
                className="w-full sm:w-auto"
                onClick={handleBuyNow}
                isLoading={checkoutMutation.isPending}
              >
                {checkoutMutation.isPending ? t('courseDetail.startingCheckout') : t('courseDetail.buyNow')}
              </Button>
            </Card>
          </div>

          <Card className="flex w-full flex-col lg:w-[348px] lg:shrink-0">
            <div className="shrink-0">
              <h2 className="text-h3 font-semibold">{t('courseDetail.lessons')}</h2>
              <p className="mt-1 text-sm text-muted">{t('courseDetail.lessonsLockedHint')}</p>
              <hr className="my-4 border-border" />
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
              {previewLessons.length === 0 ? (
                <p className="text-sm text-muted">{t('courseDetail.noLessonsYet')}</p>
              ) : (
                previewLessons.map((lesson) => (
                  <CourseModuleItem
                    key={lesson.id}
                    title={lesson.title}
                    subtitle={lesson.subtitle}
                    completed={false}
                    active={false}
                    locked
                  />
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const completedCount = lessons.filter((lesson) => lesson.completed).length
  const progressPercent =
    lessons.length === 0 ? 0 : Math.round((completedCount / lessons.length) * 100)

  const handleMarkAsDone = () => {
    if (!selectedLesson || selectedLesson.completed) return

    markComplete.mutate(selectedLesson.id, {
      onSuccess: (progress) => {
        const finished = new Set(progress.finishedLessonKeys)
        const next = lessons.find((lesson) => !finished.has(lesson.id))
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

      <div className="flex flex-col items-stretch gap-6 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {selectedLesson ? (
            <LessonVideoPlayer
              videoUrl={videoQuery.data}
              posterSrc={course.imageSrc}
              posterAlt={selectedLesson.title}
              onNearlyFinished={handleMarkAsDone}
            />
          ) : lessons.length === 0 ? (
            <Card>
              <p className="text-sm text-muted">{t('courseDetail.noLessonsYet')}</p>
            </Card>
          ) : null}

          {selectedLesson ? (
            <Card className="flex items-center justify-between gap-6">
              <div>
                <h2 className="text-h3 font-semibold">{selectedLesson.title}</h2>
                {selectedLesson.subtitle ? (
                  <p className="text-sm">{selectedLesson.subtitle}</p>
                ) : null}
                {selectedLesson.durationSeconds ? (
                  <p className="mt-2 text-sm text-muted">
                    {t('courseDetail.videoDuration')}{' '}
                    <strong>{formatDuration(selectedLesson.durationSeconds)}</strong>
                  </p>
                ) : null}
              </div>
              {selectedLesson.completed ? null : (
                <Button
                  variant="accent"
                  disabled={markComplete.isPending}
                  onClick={handleMarkAsDone}
                >
                  {markComplete.isPending
                    ? t('courseDetail.markingAsDone')
                    : t('courseDetail.markAsDone')}
                </Button>
              )}
            </Card>
          ) : null}
        </div>

        <Card className="flex w-full flex-col lg:w-[348px] lg:shrink-0">
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
            {lessons.length === 0 ? (
              <p className="text-sm text-muted">{t('courseDetail.noLessonsYet')}</p>
            ) : (
              lessons.map((lesson) => (
                <CourseModuleItem
                  key={lesson.id}
                  title={lesson.title}
                  subtitle={lesson.subtitle}
                  completed={lesson.completed}
                  active={lesson.id === selectedLesson?.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                />
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
