/**
 * STUBBED — no `userStats`/`userCourses`/`userActivities` API client
 * exists yet (blocked on SDS §6, see TODO.md). Shape is designed to be a
 * drop-in swap once `queryKeys.userStats()` etc. have real client
 * functions behind them. See STUBBED_DATA.md for the full list.
 */

export interface DashboardStat {
  label: string
  value: number
  color: 'primary' | 'warning' | 'success' | 'highlight'
  helperText: string
}

export const existingUserStats: DashboardStat[] = [
  { label: 'My Learning List', value: 8, color: 'primary', helperText: '+ 1 this month' },
  { label: 'Skills Unlocked', value: 6, color: 'warning', helperText: '75% completion rate' },
  { label: 'Hours Learned', value: 40, color: 'success', helperText: '+ 1 this month' },
  { label: 'My Certificates', value: 5, color: 'highlight', helperText: '1 certificate in review' },
]

export const newUserStatLabels = [
  'My Learning List',
  'Skills Unlocked',
  'Hours Learned',
  'My Certificates',
] as const

export interface LearningProgressItem {
  title: string
  progress: number
  /** CSS color for both the percentage text and the bar fill (decorative rotation, not a Status). */
  color: string
}

export const learningProgress: LearningProgressItem[] = [
  {
    title: 'Fondasi Komunikasi: Berani Bicara, Pede Tanpa Nervous',
    progress: 60,
    color: 'var(--color-primary)',
  },
  { title: 'The Art of MC: How to be Great MC', progress: 80, color: 'var(--color-warning)' },
  {
    title: 'Tips & Trik: Mengatasi Rasa Gugup',
    progress: 0,
    color: 'var(--color-success)',
  },
]

export interface RecentActivityItem {
  description: string
  timeAgo: string
  dotColor: string
}

export const recentActivity: RecentActivityItem[] = [
  {
    description: 'Completed Module 5 - Fondasi Komunikasi: Berani Bicara, Pede Tanpa Nervous',
    timeAgo: '2h ago',
    dotColor: 'var(--color-primary)',
  },
  {
    description: 'Completed Module 7 - The Art of MC: How to be Great MC',
    timeAgo: '18h ago',
    dotColor: 'var(--color-warning)',
  },
  {
    description: 'Purchased Tips & Trik: Mengatasi Rasa Gugup',
    timeAgo: '1d ago',
    dotColor: 'var(--color-success)',
  },
]
