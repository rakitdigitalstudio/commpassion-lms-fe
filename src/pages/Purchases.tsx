import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { useGetUserCoursesQuery } from '@/api/user/queries/useGetUserCoursesQuery'
import { Button } from '@/components/Button'
import { CourseCard } from '@/components/CourseCard'
import { EmptyState } from '@/components/EmptyState'
import { FilterChip } from '@/components/FilterChip'
import { FullPageLoader } from '@/components/FullPageLoader'
import { InboxIcon, PlusIcon } from '@/components/icons'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import type { CourseProgressStatus } from '@/api/user/types'

type Filter = 'all' | 'in-progress' | 'completed'

const CTA_LABEL_KEYS: Record<CourseProgressStatus, string> = {
  'not-started': 'purchases.cta.start',
  'in-progress': 'purchases.cta.continue',
  completed: 'purchases.cta.viewCertificate',
}

export function Purchases() {
  const [filter, setFilter] = useState<Filter>('all')
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: purchasedCourses = [], isLoading } = useGetUserCoursesQuery()

  const inProgressCount = purchasedCourses.filter((c) => c.status === 'in-progress').length
  const completedCount = purchasedCourses.filter((c) => c.status === 'completed').length

  const visibleCourses = useMemo(() => {
    if (filter === 'all') return purchasedCourses
    return purchasedCourses.filter((course) => course.status === filter)
  }, [filter, purchasedCourses])

  const hasCourses = purchasedCourses.length > 0

  // Without this, the empty state would flash before the courses load.
  if (isLoading) {
    return <FullPageLoader />
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('purchases.title')}
        subtitle={
          hasCourses
            ? t('purchases.subtitleWithCourses', { count: purchasedCourses.length })
            : t('purchases.subtitleEmpty')
        }
        action={
          <Link to="/explore">
            <Button variant="primary" className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              {t('purchases.browseMore')}
            </Button>
          </Link>
        }
      />

      <div className="flex gap-5">
        <StatCard
          label={t('purchases.stats.learningList')}
          value={purchasedCourses.length}
          color="primary"
          icon={<span className="text-4xl">📚</span>}
          className="flex-1"
        />
        <StatCard
          label={t('purchases.stats.inProgress')}
          value={inProgressCount}
          color="warning"
          icon={<span className="text-4xl">⚡</span>}
          className="flex-1"
        />
        <StatCard
          label={t('purchases.stats.completed')}
          value={completedCount}
          color="success"
          icon={<span className="text-4xl">🏆</span>}
          className="flex-1"
        />
      </div>

      {hasCourses ? (
        <>
          <div className="flex gap-2">
            <FilterChip
              label={t('purchases.filters.all')}
              count={purchasedCourses.length}
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            />
            <FilterChip
              label={t('purchases.filters.inProgress')}
              count={inProgressCount}
              active={filter === 'in-progress'}
              onClick={() => setFilter('in-progress')}
            />
            <FilterChip
              label={t('purchases.filters.completed')}
              count={completedCount}
              active={filter === 'completed'}
              onClick={() => setFilter('completed')}
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            {visibleCourses.map((course) => (
              <CourseCard
                key={course.courseId}
                variant="purchased"
                courseId={course.courseId}
                title={course.title}
                instructorName={course.instructorName}
                imageSrc={course.imageSrc}
                moduleCount={course.totalLessons}
                completedModules={course.completedLessons}
                status={course.status}
                progress={course.progress}
                ctaLabel={t(CTA_LABEL_KEYS[course.status])}
                // Routes every CTA (Continue/Start/View Certificate) to the
                // course detail page — no dedicated certificate page exists
                // yet, so "View Certificate" lands there too for now.
                onCtaClick={() => navigate(`/courses/${course.courseId}`)}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={
            <span className="flex items-center justify-center rounded-full bg-primary/25 p-5">
              <InboxIcon className="h-10 w-10 text-primary" />
            </span>
          }
          heading={t('purchases.emptyHeading')}
          subtext={t('purchases.emptySubtext')}
          cta={
            <Link to="/explore">
              <Button variant="primary" className="text-xs">
                {t('purchases.browseCourses')}
              </Button>
            </Link>
          }
        />
      )}
    </div>
  )
}
