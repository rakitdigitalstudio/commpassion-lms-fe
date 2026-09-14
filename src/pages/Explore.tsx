import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { AppShell } from '@/components/AppShell'
import { Button } from '@/components/Button'
import { CourseCard } from '@/components/CourseCard'
import { EmptyState } from '@/components/EmptyState'
import { FullPageLoader } from '@/components/FullPageLoader'
import { FilterIcon, SearchIcon } from '@/components/icons'
import { Logo } from '@/components/Logo'
import { PageHeader } from '@/components/PageHeader'
import { useUserAuthenticationContext } from '@/context/UserAuthenticationContext'
import { catalogCourses } from '@/lib/stub-data/catalog'

/**
 * Public route (also linked from the logged-out Login page), but the
 * content differs by auth state: a guest sees the pre-existing
 * "under construction" placeholder unchanged, while a signed-in user sees
 * the real catalog wrapped in the same Sidebar/Topbar shell as the other
 * dashboard pages — see TODO.md's note on this exact page/decision.
 */
export function Explore() {
  const { user, isLoading } = useUserAuthenticationContext()
  const { t } = useTranslation()

  if (isLoading) {
    return <FullPageLoader />
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
        <Logo className="h-16 w-auto" />
        <EmptyState
          icon="🚧"
          heading={t('common.underConstruction.heading')}
          subtext={t('common.underConstruction.body')}
          cta={
            <Link to="/login">
              <Button variant="outline">{t('common.underConstruction.backToLogin')}</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <PageHeader title={t('explore.title')} subtitle={t('explore.subtitle')} />

        <div className="flex gap-6">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder={t('explore.searchPlaceholder')}
              className="w-full rounded-control border border-border bg-background py-2 pr-4 pl-11 text-sm placeholder:text-muted focus:ring-2 focus:ring-primary/40 focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="flex w-[212px] items-center justify-center gap-2 rounded-control border border-border bg-background px-4 py-2 text-sm"
          >
            <FilterIcon className="h-5 w-5" />
            {t('explore.mostPopular')}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {catalogCourses.map((course) => (
            <CourseCard
              key={course.slug}
              variant="catalog"
              slug={course.slug}
              title={course.title}
              instructorName={course.instructorName}
              imageSrc={course.imageSrc}
              rating={course.rating}
              reviewCount={course.reviewCount}
              moduleCount={course.moduleCount}
              // Figma's catalog cards show "4/6 Module Videos" on every
              // card regardless of course — read as a free-preview count,
              // not a purchased/completed fraction. Reproduced as-is.
              completedModules={4}
              durationLabel={course.durationLabel}
              price={course.price}
            />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
