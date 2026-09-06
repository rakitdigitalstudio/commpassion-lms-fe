import { useTranslation } from 'react-i18next'

import courseImage from '@/assets/course-placeholder-mc.png'
import { Progress } from '@/components/Progress'

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

/**
 * Promo panel shared by Login, Register, and Forgot Password (right box
 * of AuthLayout). Copy/stats are hardcoded per the mockup — Ticket #9
 * flags this exact question ("confirm with Irene whether this is
 * hardcoded or should eventually come from Strapi site_config") —
 * unresolved, see TODO.md. The course image (565x424 in Figma) is the
 * placeholder photo provided in Ticket #41, not final course artwork.
 */
export function AuthPromoPanel() {
  const { t } = useTranslation()

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

        <div className="mt-8 flex gap-8">
          <PromoStat value="5000+" label={t('auth.promo.stats.voices')} />
          <PromoStat value="150+" label={t('auth.promo.stats.experiences')} />
          <PromoStat value="50+" label={t('auth.promo.stats.partnerships')} />
        </div>

        <div className="mt-8 overflow-hidden rounded-card shadow-promo">
          <div className="relative aspect-[565/424]">
            <img src={courseImage} alt="" className="h-full w-full object-cover" />
            <span className="bg-accent text-foreground absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold">
              {t('auth.promo.featuredCourse')}
            </span>
          </div>
          <div className="bg-primary p-4">
            <p className="font-semibold">{t('auth.promo.courseTitle')}</p>
            <p className="text-sm opacity-90">{t('auth.promo.courseMeta')}</p>
            <div className="mt-3 flex items-center gap-3">
              <Progress value={20} color="#078CB580" className="flex-1" />
              <span className="text-xs opacity-90">20%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
