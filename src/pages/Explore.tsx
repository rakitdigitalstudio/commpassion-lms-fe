import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { useGetCoursesQuery } from '@/api/courses/queries/useGetCoursesQuery'
import { AppShell } from '@/components/AppShell'
import { Button } from '@/components/Button'
import { CourseCard } from '@/components/CourseCard'
import { EmptyState } from '@/components/EmptyState'
import { FullPageLoader } from '@/components/FullPageLoader'
import { SearchIcon } from '@/components/icons'
import { Logo } from '@/components/Logo'
import { PageHeader } from '@/components/PageHeader'
import { useUserAuthenticationContext } from '@/context/UserAuthenticationContext'
import { COURSE_SEARCH_PARAM, matchesCourseSearch } from '@/lib/course-search'

/**
 * Public route (Ticket #53) — the storefront ("here's what we offer"), so
 * it always shows the real catalog to guests and signed-in users alike.
 * Only the surrounding chrome differs: signed-in gets the normal
 * Sidebar/Topbar AppShell; a guest gets a bare logo header instead, since
 * AppShell stays scoped to authenticated screens (Ticket #7).
 *
 * Search filters the already-loaded catalog in the browser (it's one
 * request for the whole catalog) and lives in `?q=` so results survive a
 * refresh and Topbar's search can land here.
 */
export function Explore() {
  const { user, isLoading } = useUserAuthenticationContext()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: courses = [], isLoading: isCoursesLoading } = useGetCoursesQuery()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get(COURSE_SEARCH_PARAM) ?? ''
  const visibleCourses = courses.filter((course) => matchesCourseSearch(course, query))

  function setQuery(next: string) {
    // replace: typing shouldn't push a history entry per keystroke.
    setSearchParams(next ? { [COURSE_SEARCH_PARAM]: next } : {}, { replace: true })
  }

  if (isLoading || isCoursesLoading) {
    return <FullPageLoader />
  }

  const catalog = (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('explore.title')} subtitle={t('explore.subtitle')} />

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('explore.searchPlaceholder')}
          aria-label={t('explore.searchPlaceholder')}
          className="w-full rounded-control border border-border bg-background py-2 pr-4 pl-11 text-sm placeholder:text-muted focus:ring-2 focus:outline-none"
        />
      </div>

      {query && visibleCourses.length === 0 ? (
        <EmptyState
          icon={
            <span className="flex items-center justify-center rounded-full bg-primary/25 p-5">
              <SearchIcon className="h-10 w-10 text-primary" />
            </span>
          }
          heading={t('explore.noResultsHeading', { query: query.trim() })}
          subtext={t('explore.noResultsSubtext')}
          cta={
            <Button variant="primary" className="text-xs" onClick={() => setQuery('')}>
              {t('explore.clearSearch')}
            </Button>
          }
        />
      ) : null}

      <div className="grid grid-cols-3 gap-6">
        {visibleCourses.map((course) => (
          <CourseCard
            key={course.courseId}
            variant="catalog"
            courseId={course.courseId}
            title={course.title}
            instructorName={course.instructorName}
            imageSrc={course.imageSrc}
            price={course.price}
            onBuyClick={() => {
              const returnTo = `/courses/${course.courseId}`

              if (!user) {
                // Not registered yet — send them to sign up first, and
                // carry the course along so Register/Login can send them
                // back here instead of the generic dashboard.
                navigate('/register', { state: { returnTo } })
                return
              }

              // No real checkout flow yet (Ticket #22) — land on the
              // course detail page as the closest real next step.
              navigate(returnTo)
            }}
          />
        ))}
      </div>
    </div>
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border p-6">
          <Link to="/login">
            <Logo className="h-8 w-auto" />
          </Link>
        </header>
        <div className="p-6">{catalog}</div>
      </div>
    )
  }

  return <AppShell>{catalog}</AppShell>
}
