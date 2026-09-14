import courseCoverArtOfMc from '@/assets/course-cover-art-of-mc.png'
import courseCoverFondasiKomunikasi from '@/assets/course-cover-fondasi-komunikasi.png'
import courseCoverTipsTrik from '@/assets/course-cover-tips-trik.png'
import type { Status } from '@/components/StatusBadge'

/**
 * STUBBED — no `userCourses`/`userStats` API client exists yet (blocked on
 * SDS §6, see TODO.md). See STUBBED_DATA.md for the full list, including
 * where the cover images came from.
 */
export interface PurchasedCourse {
  slug: string
  title: string
  instructorName: string
  imageSrc: string
  moduleCount: number
  completedModules: number
  durationLabel: string
  status: Status
  /** 0-100 */
  progress: number
  ctaLabel: string
}

export const purchasedCourses: PurchasedCourse[] = [
  {
    slug: 'fondasi-komunikasi',
    title: 'Fondasi Komunikasi: Berani Bicara, Pede Tanpa Nerveous',
    instructorName: 'Indra Herlambang',
    imageSrc: courseCoverFondasiKomunikasi,
    moduleCount: 6,
    completedModules: 4,
    durationLabel: '18h 30m',
    status: 'in-progress',
    progress: 60,
    ctaLabel: 'Continue Course',
  },
  {
    slug: 'art-of-mc',
    title: 'The Art of MC: How To Be A Great MC',
    instructorName: 'Nadia Mulya',
    imageSrc: courseCoverArtOfMc,
    moduleCount: 6,
    completedModules: 6,
    durationLabel: '18h 30m',
    status: 'completed',
    progress: 100,
    ctaLabel: 'View Certificate',
  },
  {
    slug: 'tips-trik-gugup',
    title: 'Tips & Trik: Cara Mengatasi Rasa Gugup',
    instructorName: 'Lenna Tan',
    imageSrc: courseCoverTipsTrik,
    moduleCount: 6,
    completedModules: 0,
    durationLabel: '18h 30m',
    status: 'not-started',
    // Figma's own "Not Started" card shows a 0-width bar despite a "60%"
    // label next to it — read as a mockup content error, not intentional;
    // normalized to 0 here so the label and bar agree.
    progress: 0,
    ctaLabel: 'Start Course',
  },
]

export const emptyPurchasedCourses: PurchasedCourse[] = []
