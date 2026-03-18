import { notFound } from 'next/navigation'
import { mockCourses } from '@/mocks/courses'
import { mockSubscription } from '@/mocks/user'
import { mockTiers } from '@/mocks/tiers'
import { CourseDetailClient } from '@/components/features/courses/CourseDetailClient'

interface CoursePageProps {
  params: { slug: string }
}

export default function CoursePage({ params }: CoursePageProps) {
  const course = mockCourses.find((c) => c.slug === params.slug)

  if (!course) {
    notFound()
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <CourseDetailClient
        course={course}
        subscription={mockSubscription}
        tiers={mockTiers}
      />
    </main>
  )
}

export function generateStaticParams() {
  return mockCourses.map((c) => ({ slug: c.slug }))
}
