import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { useGetCoursesQuery } from '@/api/courses/queries/useGetCoursesQuery'
import { AppShell } from '@/components/AppShell'
import { Button } from '@/components/Button'
import { CourseCard } from '@/components/CourseCard'
import { EmptyState } from '@/components/EmptyState'
import { FullPageLoader } from '@/components/FullPageLoader'
import { InboxIcon, SearchIcon, SpinnerIcon } from '@/components/icons'
import { Logo } from '@/components/Logo'
import { PageHeader } from '@/components/PageHeader'
import { Pagination } from '@/components/Pagination'
import { useUserAuthenticationContext } from '@/context/UserAuthenticationContext'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { usePagination } from '@/hooks/usePagination'
import { COURSE_SEARCH_PARAM } from '@/lib/course-search'

/** 3 rows of the 3-column grid. */
const PAGE_SIZE = 9
const SEARCH_DEBOUNCE_MS = 300

/**
 * Public route (Ticket #53) — the storefront ("here's what we offer"), so
 * it always shows the real catalog to guests and signed-in users alike.
 * Only the surrounding chrome differs: signed-in gets the normal
 * Sidebar/Topbar AppShell; a guest gets a bare logo header instead, since
 * AppShell stays scoped to authenticated screens (Ticket #7).
 *
 * Search and paging run server-side in Strapi. Both live in the URL
 * (`?q=…&page=…`) so they survive a refresh and Topbar's search can land
 * here; the request waits until typing pauses, and the previous results
 * stay on screen (dimmed) while the next ones load.
 */
export function Explore() {
  const { user, isLoading } = useUserAuthenticationContext()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { page, pageSize, setPage, param: pageParam } = usePagination({ pageSize: PAGE_SIZE })

  const query = searchParams.get(COURSE_SEARCH_PARAM) ?? ''
  const search = useDebouncedValue(query.trim(), SEARCH_DEBOUNCE_MS)
  const coursesQuery = useGetCoursesQuery({ search, page, pageSize })
  const result = coursesQuery.data
  const courses = result?.items ?? []
  // Still typing, or the new page/search is in flight.
  const isSearching = query.trim() !== search || coursesQuery.isPlaceholderData

  function setQuery(next: string) {
    setSearchParams(
      (previous) => {
        const params = new URLSearchParams(previous)
        if (next) {
          params.set(COURSE_SEARCH_PARAM, next)
        } else {
          params.delete(COURSE_SEARCH_PARAM)
        }
        // A new search starts back at page 1.
        params.delete(pageParam)
        return params
      },
      // Typing shouldn't push a history entry per keystroke.
      { replace: true },
    )
  }

  if (isLoading) {
    return <FullPageLoader />
  }

  let results
  if (coursesQuery.isLoading) {
    results = (
      <div className="flex justify-center py-16 text-muted">
        <SpinnerIcon className="h-8 w-8" />
      </div>
    )
  } else if (courses.length === 0 && search) {
    results = (
      <EmptyState
        icon={
          <span className="flex items-center justify-center rounded-full bg-primary/25 p-5">
            <SearchIcon className="h-10 w-10 text-primary" />
          </span>
        }
        heading={t('explore.noResultsHeading', { query: search })}
        subtext={t('explore.noResultsSubtext')}
        cta={
          <Button variant="primary" className="text-xs" onClick={() => setQuery('')}>
            {t('explore.clearSearch')}
          </Button>
        }
      />
    )
  } else if (courses.length === 0) {
    results = (
      <EmptyState
        icon={
          <span className="flex items-center justify-center rounded-full bg-primary/25 p-5">
            <InboxIcon className="h-10 w-10 text-primary" />
          </span>
        }
        heading={t('explore.emptyHeading')}
        subtext={t('explore.emptySubtext')}
      />
    )
  } else {
    results = (
      <div
        className={`grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${isSearching ? 'opacity-50' : ''}`}
        aria-busy={isSearching}
      >
        {courses.map((course) => (
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
    )
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
          className="w-full rounded-control border border-border bg-background py-2 pr-11 pl-11 text-sm placeholder:text-muted focus:ring-2 focus:outline-none"
        />
        {isSearching && !coursesQuery.isLoading ? (
          <span
            role="status"
            aria-label={t('explore.searching')}
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted"
          >
            <SpinnerIcon className="h-5 w-5" />
          </span>
        ) : null}
      </div>

      {results}

      <Pagination
        page={page}
        pageCount={result?.pageCount ?? 0}
        onPageChange={setPage}
        disabled={isSearching}
      />
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
