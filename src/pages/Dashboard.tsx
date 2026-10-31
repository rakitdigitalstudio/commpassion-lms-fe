import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useSetIsNewUserMutation } from '@/api/user/mutations/useSetIsNewUserMutation'
import { useGetUserActivitiesQuery } from '@/api/user/queries/useGetUserActivitiesQuery'
import { useGetUserCoursesQuery } from '@/api/user/queries/useGetUserCoursesQuery'
import { useGetUserStatsQuery } from '@/api/user/queries/useGetUserStatsQuery'
import { ActivityItem } from '@/components/ActivityItem'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { FullPageLoader } from '@/components/FullPageLoader'
import { InboxIcon } from '@/components/icons'
import { IntroductionVideoCard } from '@/components/IntroductionVideoCard'
import { PageHeader } from '@/components/PageHeader'
import { Progress } from '@/components/Progress'
import { SectionCard } from '@/components/SectionCard'
import { StatCard } from '@/components/StatCard'
import { useUserAuthenticationContext } from '@/context/UserAuthenticationContext'
import { formatTimeAgo } from '@/lib/format-time'

/** Decorative per-row rotation for Learning Progress (not a Status). */
const PROGRESS_COLORS = ['var(--color-primary)', 'var(--color-warning)', 'var(--color-success)']

/** Recent Activity dot per activity type; unknown types fall back to warning. */
const ACTIVITY_COLORS: Record<string, string> = {
  enrolled: 'var(--color-primary)',
  purchased: 'var(--color-success)',
}

/**
 * A learner with no enrollments sees the New User state (Figma's empty
 * state) — decided from /user/stats, so it holds for every real account.
 */
export function Dashboard() {
  const { user } = useUserAuthenticationContext()
  const { t, i18n } = useTranslation()
  const firstName = user?.fullName.split(' ')[0] ?? ''

  const { data: stats, isLoading: isStatsLoading } = useGetUserStatsQuery()
  const isNewUser = stats?.coursesEnrolled === 0
  const setIsNewUser = useSetIsNewUserMutation()

  // A new user has nothing to list yet, so skip those requests entirely.
  const enabled = stats !== undefined && !isNewUser
  const { data: courses = [], isLoading: isCoursesLoading } = useGetUserCoursesQuery({ enabled })
  const { data: activities = [], isLoading: isActivitiesLoading } = useGetUserActivitiesQuery({
    enabled,
  })

  if (isStatsLoading || isCoursesLoading || isActivitiesLoading) {
    return <FullPageLoader />
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t(isNewUser ? 'dashboard.welcomeNew' : 'dashboard.welcomeBack', {
          name: firstName,
        })}
        subtitle={t('dashboard.subtitle')}
      />

      {user?.isNewUser ? (
        <IntroductionVideoCard
          onHide={() => setIsNewUser.mutate(false)}
          isHiding={setIsNewUser.isPending}
        />
      ) : null}

      <div className="flex flex-col gap-5 sm:flex-row">
        <StatCard
          label={t('dashboard.stats.learningList')}
          value={stats?.coursesEnrolled ?? 0}
          color="primary"
          muted={isNewUser}
          className="flex-1"
        />
        <StatCard
          label={t('dashboard.stats.certificates')}
          value={stats?.certificatesCount ?? 0}
          color="highlight"
          muted={isNewUser}
          className="flex-1"
        />
        <StatCard
          label={t('dashboard.stats.certificatesInReview')}
          value={stats?.certificatesInReview ?? 0}
          color="warning"
          muted={isNewUser}
          className="flex-1"
        />
      </div>

      {isNewUser ? (
        <SectionCard title={t('dashboard.courseProgress')}>
          <EmptyState
            icon={
              <span className="flex items-center justify-center rounded-full bg-primary/25 p-5">
                <InboxIcon className="h-10 w-10 text-primary" />
              </span>
            }
            heading={t('dashboard.emptyHeading')}
            subtext={t('dashboard.emptySubtext')}
            cta={
              <Link to="/explore">
                <Button variant="primary" className="text-xs">
                  {t('dashboard.browseCourses')}
                </Button>
              </Link>
            }
          />
        </SectionCard>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          <SectionCard
            title={t('dashboard.learningProgress')}
            action={
              <Link to="/purchases" className="text-sm font-bold text-primary">
                {t('dashboard.viewAll')}
              </Link>
            }
            className="flex-1"
          >
            <div className="flex flex-col gap-4">
              {courses.map((course, index) => {
                const color = PROGRESS_COLORS[index % PROGRESS_COLORS.length]

                return (
                  <div key={course.courseId} className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2 text-sm">
                      <span className="font-medium">{course.title}</span>
                      <span className="font-bold" style={{ color }}>
                        {course.progress}%
                      </span>
                    </div>
                    <Progress value={course.progress} color={color} />
                  </div>
                )
              })}
            </div>
          </SectionCard>

          <SectionCard title={t('dashboard.recentActivity')} className="flex-1">
            <div className="flex flex-col gap-4">
              {activities.length === 0 ? (
                <p className="text-sm text-muted">{t('dashboard.noActivity')}</p>
              ) : (
                activities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    description={activity.description}
                    timeAgo={formatTimeAgo(activity.timestamp, i18n.language)}
                    dotColor={ACTIVITY_COLORS[activity.type] ?? 'var(--color-warning)'}
                  />
                ))
              )}
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  )
}
