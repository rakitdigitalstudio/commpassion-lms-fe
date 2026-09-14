import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ActivityItem } from '@/components/ActivityItem'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { InboxIcon } from '@/components/icons'
import { IntroductionVideoCard } from '@/components/IntroductionVideoCard'
import { PageHeader } from '@/components/PageHeader'
import { Progress } from '@/components/Progress'
import { SectionCard } from '@/components/SectionCard'
import { StatCard } from '@/components/StatCard'
import { useUserAuthenticationContext } from '@/context/UserAuthenticationContext'
import {
  existingUserStats,
  learningProgress,
  newUserStatLabels,
  recentActivity,
} from '@/lib/stub-data/dashboard'
import { siteConfig } from '@/lib/stub-data/site-config'

/**
 * `isNewUser` comes from the authenticated user record itself (see
 * useUserAuthentication / STUBBED_DATA.md) — not a URL toggle. The mock
 * backend sets it true for a freshly registered account and false for the
 * seeded demo login, so both Figma states are reachable through the real
 * register -> login flow.
 */
export function Dashboard() {
  const { user } = useUserAuthenticationContext()
  const { t } = useTranslation()
  const isNewUser = user?.isNewUser ?? false
  const firstName = user?.fullName.split(' ')[0] ?? ''

  // Stat labels/course/activity content are stub *data* (stand-ins for a
  // future API response, see STUBBED_DATA.md) rather than app copy, so
  // they aren't run through i18n like the surrounding chrome is.
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t(isNewUser ? 'dashboard.welcomeNew' : 'dashboard.welcomeBack', {
          name: firstName,
        })}
        subtitle={t('dashboard.subtitle')}
      />

      <div className="flex gap-5">
        {isNewUser
          ? newUserStatLabels.map((label) => (
              <StatCard key={label} label={label} value={0} muted className="flex-1" />
            ))
          : existingUserStats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                color={stat.color}
                helperText={stat.helperText}
                className="flex-1"
              />
            ))}
      </div>

      <IntroductionVideoCard
        videoSrc={siteConfig.introVideo.videoSrc}
        posterSrc={siteConfig.introVideo.posterSrc}
        defaultOpen={isNewUser}
      />

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
        <div className="flex gap-6">
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
              {learningProgress.map((item) => (
                <div key={item.title} className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2 text-sm">
                    <span className="font-medium">{item.title}</span>
                    <span className="font-bold" style={{ color: item.color }}>
                      {item.progress}%
                    </span>
                  </div>
                  <Progress value={item.progress} color={item.color} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title={t('dashboard.recentActivity')} className="flex-1">
            <div className="flex flex-col gap-4">
              {recentActivity.map((activity) => (
                <ActivityItem
                  key={activity.description}
                  description={activity.description}
                  timeAgo={activity.timeAgo}
                  dotColor={activity.dotColor}
                />
              ))}
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  )
}
