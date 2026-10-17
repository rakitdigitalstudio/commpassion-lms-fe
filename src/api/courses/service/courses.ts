import type { Course, CourseDetail, StrapiCourse } from '@/api/courses/types'
import { STRAPI_ENDPOINTS } from '@/api/core/endpoints'
import { strapiUrl } from '@/api/core/http'
import { purchasedCourses } from '@/lib/stub-data/purchases'

export class CourseNotFoundError extends Error {}

// Strapi v5 only returns relations/media that are explicitly populated.
const COURSE_POPULATE = 'populate[0]=coverImage&populate[1]=instructor'

function toCourse(course: StrapiCourse): Course {
  return {
    courseId: course.documentId,
    title: course.title,
    instructorName: course.instructor?.name ?? '',
    imageSrc: course.coverImage ? strapiUrl(course.coverImage.url) : undefined,
    price: course.price ?? 0,
  }
}

/**
 * The public catalog, read live from Strapi (public role — the backoffice
 * course controller already filters to published courses and strips
 * lesson video URLs for anonymous callers).
 */
export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${strapiUrl(STRAPI_ENDPOINTS.courses)}?${COURSE_POPULATE}`)

  if (!res.ok) {
    throw new Error(`getCourses failed: ${res.status}`)
  }

  const { data } = (await res.json()) as { data: StrapiCourse[] }

  return data.map(toCourse)
}

/**
 * PROVISIONAL course-detail client. Course info comes from Strapi;
 * `enrolled` is still decided from the purchases stub (checked first, so
 * My Purchases' stub links keep working) until the Golang
 * /api/v1/user/courses query lands (#55). Call sites stay the same.
 */
export async function getCourseDetail(courseId: string): Promise<CourseDetail> {
  const purchased = purchasedCourses.find((course) => course.courseId === courseId)
  if (purchased) {
    return {
      courseId: purchased.courseId,
      title: purchased.title,
      instructorName: purchased.instructorName,
      imageSrc: purchased.imageSrc,
      enrolled: true,
    }
  }

  const res = await fetch(`${strapiUrl(STRAPI_ENDPOINTS.course(courseId))}?${COURSE_POPULATE}`)

  if (res.status === 404) {
    throw new CourseNotFoundError(`No course found for id "${courseId}"`)
  }

  if (!res.ok) {
    throw new Error(`getCourseDetail failed: ${res.status}`)
  }

  const { data } = (await res.json()) as { data: StrapiCourse }

  return { ...toCourse(data), enrolled: false }
}
