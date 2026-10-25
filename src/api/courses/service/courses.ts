import type {
  Course,
  CourseDetail,
  CourseListParams,
  StrapiCourse,
  StrapiLesson,
} from '@/api/courses/types'
import { API_ENDPOINTS, STRAPI_ENDPOINTS } from '@/api/core/endpoints'
import { getApiData, strapiUrl } from '@/api/core/http'
import type { Page, StrapiPagination } from '@/api/core/pagination'
import type { UserCourseResponse } from '@/api/user/types'

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
 * One page of the public catalog, read live from Strapi (public role — the
 * backoffice course controller already filters to published courses and
 * strips lesson video URLs for anonymous callers). `search` is matched
 * server-side, case-insensitively, against the title and the instructor's
 * name; newest courses first so paging is stable.
 */
export async function getCourses({
  search,
  page,
  pageSize,
}: CourseListParams): Promise<Page<Course>> {
  const params = new URLSearchParams({
    'populate[0]': 'coverImage',
    'populate[1]': 'instructor',
    'sort[0]': 'createdAt:desc',
    'pagination[page]': String(page),
    'pagination[pageSize]': String(pageSize),
  })

  const term = search.trim()
  if (term) {
    params.set('filters[$or][0][title][$containsi]', term)
    params.set('filters[$or][1][instructor][name][$containsi]', term)
  }

  const res = await fetch(`${strapiUrl(STRAPI_ENDPOINTS.courses)}?${params}`)

  if (!res.ok) {
    throw new Error(`getCourses failed: ${res.status}`)
  }

  const { data, meta } = (await res.json()) as {
    data: StrapiCourse[]
    meta: { pagination: StrapiPagination }
  }

  return { items: data.map(toCourse), ...meta.pagination }
}

/**
 * Catalog entries for the given courseIds, keyed by courseId — used to
 * decorate the Golang API's enrollment rows (which only carry id, title,
 * status) with cover image and instructor. Unpublished or deleted courses
 * are simply absent from the map.
 */
export async function getCoursesByIds(courseIds: string[]): Promise<Map<string, Course>> {
  if (courseIds.length === 0) {
    return new Map()
  }

  const filters = courseIds
    .map((id, index) => `filters[documentId][$in][${index}]=${encodeURIComponent(id)}`)
    .join('&')
  const res = await fetch(
    `${strapiUrl(STRAPI_ENDPOINTS.courses)}?${COURSE_POPULATE}&${filters}&pagination[pageSize]=${courseIds.length}`,
  )

  if (!res.ok) {
    throw new Error(`getCoursesByIds failed: ${res.status}`)
  }

  const { data } = (await res.json()) as { data: StrapiCourse[] }

  return new Map(data.map((course) => [course.documentId, toCourse(course)]))
}

async function fetchStrapiCourse(courseId: string, populate: string): Promise<StrapiCourse> {
  const res = await fetch(`${strapiUrl(STRAPI_ENDPOINTS.course(courseId))}?${populate}`)

  if (res.status === 404) {
    throw new CourseNotFoundError(`No course found for id "${courseId}"`)
  }

  if (!res.ok) {
    throw new Error(`Strapi course request failed: ${res.status}`)
  }

  const { data } = (await res.json()) as { data: StrapiCourse }

  return data
}

/**
 * Course info from Strapi; `enrolled` from the learner's enrollments in
 * the Golang API (Course Detail sits behind ProtectedRoute, so there's
 * always a session).
 */
export async function getCourseDetail(courseId: string): Promise<CourseDetail> {
  const [course, enrollments] = await Promise.all([
    fetchStrapiCourse(courseId, COURSE_POPULATE),
    getApiData<UserCourseResponse[]>(API_ENDPOINTS.user.courses),
  ])

  return {
    ...toCourse(course),
    enrolled: enrollments.some((enrollment) => enrollment.course_id === courseId),
  }
}

/** The course's lessons in display order (Strapi), without video URLs. */
export async function getCourseLessons(courseId: string): Promise<StrapiLesson[]> {
  const course = await fetchStrapiCourse(courseId, 'populate[0]=lessons')

  return course.lessons ?? []
}
