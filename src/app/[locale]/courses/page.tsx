import { mockCourses } from '@/mocks/courses'
import { CourseGrid } from '@/components/features/courses/CourseGrid'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('courses')

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">{t('title')}</h1>
        <p className="text-[var(--text-secondary)]">{t('subtitle')}</p>
      </div>
      <CourseGrid courses={mockCourses} />
    </main>
  )
}
