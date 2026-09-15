import { catalogCourses } from '@/lib/stub-data/catalog'
import { purchasedCourses } from '@/lib/stub-data/purchases'

/**
 * PROVISIONAL course-detail client (see TODO.md's Ticket #3 entry — blocked
 * on SDS §6). Shaped like a real Golang/Strapi call ahead of time: resolves
 * course info plus whether the current user is enrolled, so the page reads
 * `data.enrolled` off the query result instead of doing its own membership
 * check. Once a real endpoint exists, only this function's internals
 * change (it should 403/404 for a non-enrolled or unknown course instead
 * of returning `enrolled: false`) — call sites stay the same.
 */
export interface CourseDetail {
  slug: string
  title: string
  instructorName: string
  imageSrc: string
  enrolled: boolean
}

export class CourseNotFoundError extends Error {}

export async function getCourseDetail(courseId: string): Promise<CourseDetail> {
  await new Promise((resolve) => setTimeout(resolve, 150))

  const purchased = purchasedCourses.find((course) => course.slug === courseId)
  if (purchased) {
    return {
      slug: purchased.slug,
      title: purchased.title,
      instructorName: purchased.instructorName,
      imageSrc: purchased.imageSrc,
      enrolled: true,
    }
  }

  const catalogEntry = catalogCourses.find((course) => course.slug === courseId)
  if (catalogEntry) {
    return {
      slug: catalogEntry.slug,
      title: catalogEntry.title,
      instructorName: catalogEntry.instructorName,
      imageSrc: catalogEntry.imageSrc,
      enrolled: false,
    }
  }

  throw new CourseNotFoundError(`No course found for slug "${courseId}"`)
}
