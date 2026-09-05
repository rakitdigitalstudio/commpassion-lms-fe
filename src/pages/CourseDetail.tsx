import { useParams } from 'react-router-dom'

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>()

  return <h1>Course: {courseId}</h1>
}
