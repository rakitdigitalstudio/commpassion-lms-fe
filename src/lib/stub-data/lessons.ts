/**
 * STUBBED — no `getLesson()`/lesson-list client exists yet (blocked on SDS
 * §6, see TODO.md's Ticket #3 entry). See STUBBED_DATA.md.
 */
export interface Lesson {
  id: string
  moduleLabel: string
  title: string
  subtitle: string
  durationLabel: string
  /** YouTube video ID (unlisted-style test clip, not a placeholder). */
  youtubeVideoId: string
  completed: boolean
}

// Keyed the same way as `purchasedCourses` (src/lib/stub-data/purchases.ts)
// so a course's lessons line up with its enrollment record.
export const lessonsByCourseId: Record<string, Lesson[]> = {
  'fondasi-komunikasi': [
    {
      id: 'fondasi-komunikasi-1',
      moduleLabel: 'Module 1: Introduction to Growth',
      title: 'Module 1: Introduction to Growth',
      subtitle: 'Introduction and Orientation Video',
      durationLabel: '08:30',
      youtubeVideoId: 'dQw4w9WgXcQ',
      completed: true,
    },
    {
      id: 'fondasi-komunikasi-2',
      moduleLabel: 'Module 2: Finding Your Voice',
      title: 'Module 2: Finding Your Voice',
      subtitle: 'Building Confidence Before You Speak',
      durationLabel: '10:15',
      youtubeVideoId: 'dQw4w9WgXcQ',
      completed: true,
    },
    {
      id: 'fondasi-komunikasi-3',
      moduleLabel: 'Module 3: Structuring Your Message',
      title: 'Module 3: Structuring Your Message',
      subtitle: 'Getting Your Point Across Clearly',
      durationLabel: '09:45',
      youtubeVideoId: 'dQw4w9WgXcQ',
      completed: true,
    },
    {
      id: 'fondasi-komunikasi-4',
      moduleLabel: 'Module 4: Reading the Room',
      title: 'Module 4: Reading the Room',
      subtitle: 'Adapting to Your Audience',
      durationLabel: '11:00',
      youtubeVideoId: 'dQw4w9WgXcQ',
      completed: true,
    },
    {
      id: 'fondasi-komunikasi-5',
      moduleLabel: 'Module 5: Handling Nerves Live',
      title: 'Module 5: Handling Nerves Live',
      subtitle: 'Staying Calm Under Pressure',
      durationLabel: '12:20',
      youtubeVideoId: 'dQw4w9WgXcQ',
      completed: false,
    },
    {
      id: 'fondasi-komunikasi-6',
      moduleLabel: 'Module 6: Putting It All Together',
      title: 'Module 6: Putting It All Together',
      subtitle: 'Your First Confident Talk',
      durationLabel: '14:05',
      youtubeVideoId: 'dQw4w9WgXcQ',
      completed: false,
    },
  ],
}
