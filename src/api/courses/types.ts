/** A catalog entry as /explore shows it. `courseId` is Strapi's documentId. */
export interface Course {
  courseId: string
  title: string
  instructorName: string
  imageSrc?: string
  /** IDR */
  price: number
}

export interface CourseDetail {
  courseId: string
  title: string
  instructorName: string
  imageSrc?: string
  enrolled: boolean
}

/** Strapi v5 (flattened) course shape — only the fields we read. */
export interface StrapiCourse {
  documentId: string
  title: string
  price: number | null
  coverImage: { url: string } | null
  instructor: { name: string } | null
}
