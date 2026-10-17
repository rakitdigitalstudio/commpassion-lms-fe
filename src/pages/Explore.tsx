import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { useGetCoursesQuery } from '@/api/courses/queries/useGetCoursesQuery'
import { AppShell } from '@/components/AppShell'
import { CourseCard } from '@/components/CourseCard'
import { FullPageLoader } from '@/components/FullPageLoader'
import { FilterIcon, SearchIcon } from '@/components/icons'
import { Logo } from '@/components/Logo'
import { PageHeader } from '@/components/PageHeader'
import { useUserAuthenticationContext } from '@/context/UserAuthenticationContext'

/**
 * Public route (Ticket #53) — the storefront ("here's what we offer"), so
 * it always shows the real catalog to guests and signed-in users alike.
 * Only the surrounding chrome differs: signed-in gets the normal
 * Sidebar/Topbar AppShell; a guest gets a bare logo header instead, since
 * AppShell stays scoped to authenticated screens (Ticket #7).
 */
export function Explore() {
  const { user, isLoading } = useUserAuthenticationContext()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: courses = [], isLoading: isCoursesLoading } = useGetCoursesQuery()

  if (isLoading || isCoursesLoading) {
    return <FullPageLoader />
  }

  const catalog = (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('explore.title')} subtitle={t('explore.subtitle')} />

      <div className="flex gap-6">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder={t('explore.searchPlaceholder')}
            className="w-full rounded-control border border-border bg-background py-2 pr-4 pl-11 text-sm placeholder:text-muted focus:ring-2 focus:outline-none"
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
