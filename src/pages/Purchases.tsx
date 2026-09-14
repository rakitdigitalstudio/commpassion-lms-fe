import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { CourseCard } from '@/components/CourseCard'
import { EmptyState } from '@/components/EmptyState'
import { FilterChip } from '@/components/FilterChip'
import { InboxIcon, PlusIcon } from '@/components/icons'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { purchasedCourses } from '@/lib/stub-data/purchases'

type Filter = 'all' | 'in-progress' | 'completed'

export function Purchases() {
  const [filter, setFilter] = useState<Filter>('all')
  const { t } = useTranslation()

  const inProgressCount = purchasedCourses.filter((c) => c.status === 'in-progress').length
  const completedCount = purchasedCourses.filter((c) => c.status === 'completed').length
  const skillsUnlocked = completedCount

  const visibleCourses = useMemo(() => {
    if (filter === 'all') return purchasedCourses
    return purchasedCourses.filter((course) => course.status === filter)
  }, [filter])

  const hasCourses = purchasedCourses.length > 0

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
          label={t('purchases.stats.skillsUnlocked')}
          value={skillsUnlocked}
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
                key={course.slug}
                variant="purchased"
                slug={course.slug}
                title={course.title}
                instructorName={course.instructorName}
                imageSrc={course.imageSrc}
                moduleCount={course.moduleCount}
                completedModules={course.completedModules}
                durationLabel={course.durationLabel}
                status={course.status}
                progress={course.progress}
                ctaLabel={course.ctaLabel}
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
