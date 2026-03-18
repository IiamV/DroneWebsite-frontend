import { mockCourses } from '@/mocks/courses'
import { CourseGrid } from '@/components/features/courses/CourseGrid'

export default function CoursesPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">Courses</h1>
        <p className="text-[var(--text-secondary)]">
          Learn drone technology, assembly, and advanced tuning at your own pace.
        </p>
      </div>
      <CourseGrid courses={mockCourses} />
    </main>
  )
}
