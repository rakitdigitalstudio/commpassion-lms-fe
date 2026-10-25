import { useTranslation } from 'react-i18next'

import { useGetCoursesQuery } from '@/api/courses/queries/useGetCoursesQuery'
import { useGetSiteConfigQuery } from '@/api/site-config/queries/useGetSiteConfigQuery'

/** The newest course in the catalog — the same first item Explore shows. */
const FEATURED_COURSE_PARAMS = { search: '', page: 1, pageSize: 1 }

interface PromoStatProps {
  value: string
  label: string
}

function PromoStat({ value, label }: PromoStatProps) {
  return (
    <div>
      <p className="text-h2 font-bold">{value}</p>
      <p className="text-sm opacity-90">{label}</p>
    </div>
  )
}

/** "5000" → "5000+" as in the design; counts the editor already suffixed are left alone. */
function formatAchievementCount(count: string): string {
  const trimmed = count.trim()
  return trimmed.endsWith('+') ? trimmed : `${trimmed}+`
}

/**
 * Promo panel shared by Login, Register, and Forgot Password (right box
 * of AuthLayout). The headline is app copy (i18n); the stats are Strapi
 * Site Config `achievements` and the featured course is the catalog's
 * first course. Either section is simply left out while loading, if
 * Strapi is unreachable, or if there's nothing to show — a sign-in page
 * shouldn't toast or block on marketing content.
 */
export function AuthPromoPanel() {
  const { t, i18n } = useTranslation()
  const { data: siteConfig } = useGetSiteConfigQuery(i18n.language, { suppressErrorToast: true })
  const { data: featured } = useGetCoursesQuery(FEATURED_COURSE_PARAMS, {
    suppressErrorToast: true,
  })

  const achievements = siteConfig?.achievements ?? []
  const course = featured?.items[0]

  return (
    <div className="hidden items-center lg:flex">
      <div className="bg-promo w-full rounded-card p-10 text-white">
        <h2 className="text-display font-bold">
          {t('auth.promo.headlineStart')}{' '}
          <span className="font-black">{t('auth.promo.headlineInfluence')}</span>.
          <br />
          {t('auth.promo.headlineLead')}{' '}
          <span className="font-black">{t('auth.promo.headlineInspire')}</span>.
        </h2>
        <p className="mt-4 max-w-md opacity-90">{t('auth.promo.subtitle')}</p>

        {achievements.length > 0 ? (
          <div className="mt-8 flex gap-8">
            {achievements.map((achievement) => (
              <PromoStat
                key={achievement.title}
                value={formatAchievementCount(achievement.count)}
                label={achievement.title}
              />
            ))}
          </div>
        ) : null}

        {course ? (
          <div className="mt-8 overflow-hidden rounded-card shadow-promo">
            <div className="relative aspect-[565/424] bg-primary/40">
              {course.imageSrc ? (
                <img src={course.imageSrc} alt="" className="h-full w-full object-cover" />
              ) : null}
              <span className="bg-accent text-foreground absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold">
                {t('auth.promo.featuredCourse')}
              </span>
            </div>
            <div className="bg-primary p-4">
              <p className="font-semibold">{course.title}</p>
              {course.instructorName ? (
                <p className="text-sm opacity-90">
                  {t('auth.promo.byInstructor', { name: course.instructorName })}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
