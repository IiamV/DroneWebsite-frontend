import { mockCourses } from '@/mocks/courses'
import { mockSubscription } from '@/mocks/user'
import { mockTiers } from '@/mocks/tiers'
import { CourseDetailClient } from '@/components/features/courses/CourseDetailClient'
import { setRequestLocale } from 'next-intl/server'

interface CoursePageProps {
  params: Promise<{ locale: string; slug: string }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const course = mockCourses.find((c) => c.slug === slug)

  if (!course) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p className="text-[var(--text-secondary)]">Course not found.</p>
      </main>
    )
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