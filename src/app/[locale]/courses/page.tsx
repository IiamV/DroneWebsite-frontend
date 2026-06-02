import { CourseGrid } from '@/components/features/courses/CourseGrid'
import { unstable_noStore as noStore } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { getCourses } from '@/lib/db/courses'

export const dynamic = 'force-dynamic'

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  noStore()
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'courses' })

  const courses = await getCourses(locale)

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">{t('title')}</h1>
        <p className="text-[var(--text-secondary)]">{t('subtitle')}</p>
      </div>
      <CourseGrid courses={courses} />
    </main>
  )
}
