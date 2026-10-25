/** URL query param holding the Explore search text (`/explore?q=…`) — shared by Topbar and Explore. */
export const COURSE_SEARCH_PARAM = 'q'

/** Case-insensitive match on course title or instructor name; blank queries match everything. */
export function matchesCourseSearch(
  course: { title: string; instructorName: string },
  query: string,
): boolean {
  const needle = query.trim().toLocaleLowerCase()
  if (!needle) return true

  return [course.title, course.instructorName].some((field) =>
    field.toLocaleLowerCase().includes(needle),
  )
}
