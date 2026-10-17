import type { Lesson } from '@/lib/stub-data/lessons'
import { lessonsByCourseId } from '@/lib/stub-data/lessons'

/**
 * PROVISIONAL lessons client (see TODO.md's Ticket #3 entry — `getLesson`
 * is listed there as an unbuilt Golang client function, blocked on SDS
 * §6). Mutates the in-memory stub store directly, same "good enough to
 * exercise the real interaction, not a real backend" shape as the demo
 * account in STUBBED_DATA.md.
 */

export async function getLessons(courseId: string): Promise<Lesson[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))

  return lessonsByCourseId[courseId] ?? []
}

export async function markLessonComplete(courseId: string, lessonId: string): Promise<Lesson[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))

  const lessons = lessonsByCourseId[courseId]
  if (!lessons) return []

  const lesson = lessons.find((current) => current.id === lessonId)
  if (lesson) lesson.completed = true

  return lessons
}
