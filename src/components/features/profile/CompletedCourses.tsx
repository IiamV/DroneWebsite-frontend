import Link from 'next/link'
import { Award, BookOpenCheck, ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { ROUTES, localePath } from '@/constants/routes'
import type { CompletedCourse } from '@/types'

interface CompletedCoursesProps {
  courses: CompletedCourse[]
  locale: string
}

const DIFFICULTY_STYLES: Record<CompletedCourse['difficulty'], string> = {
  beginner: 'border-green-500/30 text-green-600 dark:text-green-400',
  intermediate: 'border-amber-500/30 text-amber-600 dark:text-amber-400',
  advanced: 'border-red-500/30 text-red-600 dark:text-red-400',
}

export async function CompletedCourses({ courses, locale }: CompletedCoursesProps) {
  const t = await getTranslations({ locale, namespace: 'profile' })
  const dateLocale = locale === 'vi' ? 'vi-VN' : 'en-US'

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            {t('learning')}
          </p>
          <h2 className="mt-1 text-xl font-bold text-[var(--text-primary)]">{t('completedCourses')}</h2>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--accent)]">
          <BookOpenCheck size={22} aria-hidden="true" />
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-primary)] p-6 text-center">
          <Award size={28} className="mx-auto mb-3 text-[var(--text-secondary)]" aria-hidden="true" />
          <p className="font-semibold text-[var(--text-primary)]">{t('noCompletedCourses')}</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-[var(--text-secondary)]">
            {t('noCompletedCoursesMessage')}
          </p>
          <Link
            href={localePath(locale, ROUTES.COURSES)}
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--bg-primary)]"
          >
            {t('browseCourses')}
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--border)] rounded-lg border border-[var(--border)] bg-[var(--bg-primary)]">
          {courses.map((course) => (
            <li key={course.id}>
              <Link
                href={localePath(locale, `${ROUTES.COURSES}/${course.slug}`)}
                className="grid gap-4 p-4 transition-colors hover:bg-[var(--bg-secondary)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${DIFFICULTY_STYLES[course.difficulty]}`}>
                      {t(course.difficulty)}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">{course.category}</span>
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{course.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--text-secondary)]">{course.description}</p>
                  <p className="mt-2 text-xs text-[var(--text-secondary)]">
                    {t('completedOn', {
                      date: course.completedAt.toLocaleDateString(dateLocale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }),
                    })} · {t('completedModules', { count: course.completedModules })}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)]">
                    {Math.round(course.progressPercent)}%
                  </span>
                  <ChevronRight size={18} className="text-[var(--text-secondary)]" aria-hidden="true" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
