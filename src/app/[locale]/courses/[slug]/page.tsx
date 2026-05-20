import { mockCourses } from '@/mocks/courses'
import { mockTiers } from '@/mocks/tiers'
import { getCourseBySlug, getCourseSlugs } from '@/lib/db/courses'
import { getTiers } from '@/lib/db/tiers'
import { CourseDetailClient } from '@/components/features/courses/CourseDetailClient'
import { setRequestLocale } from 'next-intl/server'
import { NotFoundError } from '@/lib/fetch-utils'

interface CoursePageProps {
  params: Promise<{ locale: string; slug: string }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  let course = mockCourses.find((c) => c.slug === slug) ?? null
  let tiers = mockTiers

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      course = await getCourseBySlug(slug)
      tiers = await getTiers()
    }
  } catch (err) {
    if (err instanceof NotFoundError) course = null
  }

  if (!course) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p className="text-[var(--text-secondary)]">Course not found.</p>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <CourseDetailClient course={course} subscription={null} tiers={tiers} />
    </main>
  )
}

export async function generateStaticParams() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const slugs = await getCourseSlugs()
      return slugs.map((slug) => ({ slug }))
    }
  } catch { /* fall through */ }
  return mockCourses.map((c) => ({ slug: c.slug }))
}
