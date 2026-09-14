import courseCoverArtOfMc from '@/assets/course-cover-art-of-mc.png'
import courseCoverFondasiKomunikasi from '@/assets/course-cover-fondasi-komunikasi.png'
import courseCoverTipsTrik from '@/assets/course-cover-tips-trik.png'

/**
 * STUBBED — no `courses` (Strapi) API client exists yet (blocked on SDS
 * §6, see TODO.md). See STUBBED_DATA.md.
 */
export interface CatalogCourse {
  slug: string
  title: string
  instructorName: string
  imageSrc: string
  rating: number
  reviewCount: number
  moduleCount: number
  durationLabel: string
  /** IDR */
  price: number
}

export const catalogCourses: CatalogCourse[] = [
  {
    slug: 'fondasi-komunikasi',
    title: 'Fondasi Komunikasi: Berani Bicara, Pede Tanpa Nervous',
    instructorName: 'Indra Herlambang',
    imageSrc: courseCoverFondasiKomunikasi,
    rating: 4.9,
    reviewCount: 20,
    moduleCount: 6,
    durationLabel: '18h 30m',
    price: 149000,
  },
  {
    slug: 'art-of-mc',
    title: 'The Art of MC: How To Be Great MC',
    instructorName: 'Nadia Mulya',
    imageSrc: courseCoverArtOfMc,
    rating: 4.9,
    reviewCount: 20,
    moduleCount: 6,
    durationLabel: '18h 30m',
    price: 149000,
  },
  {
    slug: 'tips-trik-gugup',
    title: 'Tips & Trik: Cara Mengatasi Rasa Gugup',
    instructorName: 'Lenna Tan',
    imageSrc: courseCoverTipsTrik,
    rating: 4.9,
    reviewCount: 20,
    moduleCount: 6,
    durationLabel: '18h 30m',
    price: 149000,
  },
]
