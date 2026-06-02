import { getCourseBySlug } from '@/lib/db/courses'
import { getTiers } from '@/lib/db/tiers'
import { CourseMaterialClient } from '@/components/features/courses/CourseMaterialClient'
import { NotFoundError } from '@/lib/fetch-utils'
import { setRequestLocale } from 'next-intl/server'

export const dynamic = 'force-dynamic'

interface CourseLearnPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export default async function CourseLearnPage({ params }: CourseLearnPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  let course = null
  try {
    course = await getCourseBySlug(slug, locale)
  } catch (err) {
    if (!(err instanceof NotFoundError)) throw err
  }

  const tiers = await getTiers()

  if (!course) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-[var(--text-secondary)]">Course not found.</p>
      </main>
    )
  }

  return <CourseMaterialClient course={course} tiers={tiers} />
}
