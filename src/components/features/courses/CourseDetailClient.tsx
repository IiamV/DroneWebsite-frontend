'use client'

import { ArrowLeft, Award, BookOpen, CheckCircle2, Clock3, FileQuestion, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { useSubscription } from '@/hooks/useSubscription'
import { ROUTES, localePath } from '@/constants/routes'
import type { Course, Subscription, SubscriptionTier } from '@/types'

const DIFFICULTY_COLORS: Record<Course['difficulty'], string> = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

interface CourseDetailClientProps {
  course: Course
  subscription: Subscription | null  // server-side initial value (may be stale)
  tiers: SubscriptionTier[]
}

export function CourseDetailClient({ course, tiers }: CourseDetailClientProps) {
  const t = useTranslations('courseDetail')
  const tc = useTranslations('courses')
  const locale = useLocale()

  const sorted = [...course.modules].sort((a, b) => a.order - b.order)

  // Live subscription state from Supabase
  const { hasAccess, loading } = useSubscription(tiers)

  const canAccess = course.requiredTier === 'free' || (!loading && hasAccess(course.requiredTier, tiers))
  const quizCount = sorted.reduce((count, module) => count + module.quiz.length, 0)
  const videoCount = sorted.filter((m) => m.videoUrl).length

  const durationHours = Math.floor(course.durationMinutes / 60)
  const durationMins = course.durationMinutes % 60
  const durationLabel = durationHours > 0
    ? `${durationHours}h ${durationMins > 0 ? `${durationMins}m` : ''}`.trim()
    : `${durationMins}m`
  const learnHref = localePath(locale, `${ROUTES.COURSES}/${course.slug}/learn`)
  const coursesHref = localePath(locale, ROUTES.COURSES)
  const pricingHref = localePath(locale, ROUTES.PRICING)

  return (
    <>
      <div className="mb-4">
        <Link href={coursesHref} className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <ArrowLeft size={16} aria-hidden="true" />
          {t('backToCourses')}
        </Link>
      </div>

      <section className="mb-6 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="grid gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-semibold text-[var(--accent)]">{t('provider')}</p>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="outline" style={{ borderColor: DIFFICULTY_COLORS[course.difficulty], color: DIFFICULTY_COLORS[course.difficulty] }}>
                {tc(course.difficulty)}
              </Badge>
              <Badge variant={course.requiredTier === 'free' ? 'secondary' : 'outline'}>
                {course.requiredTier === 'free' ? t('freeCourse') : t('subscriberCourse')}
              </Badge>
              <span className="text-sm text-[var(--text-secondary)] capitalize">{course.category}</span>
            </div>
            <h1 className="mb-3 max-w-3xl text-3xl font-extrabold leading-tight text-[var(--text-primary)] sm:text-4xl">
              {course.title}
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-[var(--text-secondary)]">{course.description}</p>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              {t('createdBy')} <span className="font-semibold text-[var(--text-primary)]">{t('provider')}</span>
            </p>
          </div>

          <aside className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-5 shadow-sm">
            <p className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
              {course.requiredTier === 'free' ? t('includedFree') : t('includedSubscription')}
            </p>
            <p className="mb-4 text-sm text-[var(--text-secondary)]">
              {course.requiredTier === 'free' ? t('freeAccessMessage') : t('subscriptionAccessMessage')}
            </p>
            {canAccess ? (
              <Link
                href={learnHref}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--bg-primary)] transition-opacity hover:opacity-90"
              >
                {t('startLearning')}
              </Link>
            ) : (
              <Link
                href={pricingHref}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--bg-primary)] transition-opacity hover:opacity-90"
              >
                {t('subscribeToUnlock')}
              </Link>
            )}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <CourseMetric icon={<BookOpen size={18} />} label={t('modulesLabel')} value={String(sorted.length)} />
              <CourseMetric icon={<Clock3 size={18} />} label={t('duration')} value={durationLabel} />
              <CourseMetric icon={<Award size={18} />} label={t('level')} value={tc(course.difficulty)} />
            </div>
          </aside>
        </div>

        <nav className="border-t border-[var(--border)] bg-[var(--bg-primary)] px-4 sm:px-6 lg:px-8" aria-label={t('courseSections')}>
          <div className="flex gap-6 overflow-x-auto text-sm font-semibold text-[var(--text-secondary)]">
            <a href="#about" className="border-b-2 border-[var(--accent)] py-3 text-[var(--text-primary)]">{t('about')}</a>
          </div>
        </nav>
      </section>

      <section id="about" className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-5 sm:p-6">
        <h2 className="mb-3 text-xl font-bold text-[var(--text-primary)]">{t('aboutCourse')}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">{course.description}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <CourseMetric icon={<PlayCircle size={18} />} label={t('videos')} value={String(videoCount)} />
          <CourseMetric icon={<FileQuestion size={18} />} label={t('quizzes')} value={String(quizCount)} />
          <CourseMetric icon={<CheckCircle2 size={18} />} label={t('credential')} value={course.requiredTier === 'free' ? t('freeCourse') : t('subscriberCourse')} />
        </div>

        <div className="mt-8 border-t border-[var(--border)] pt-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{t('modulesTitle', { count: sorted.length })}</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {t('modulesSummary', { count: sorted.length, duration: durationLabel })}
              </p>
            </div>
            {canAccess && (
              <Link
                href={learnHref}
                className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-primary)] px-4 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--accent)]"
              >
                {t('goToMaterials')}
              </Link>
            )}
          </div>
          <ol className="divide-y divide-[var(--border)] rounded-lg border border-[var(--border)] bg-[var(--bg-primary)]">
            {sorted.map((module, index) => (
              <li key={module.id} className="grid gap-3 p-4 sm:grid-cols-[48px_minmax(0,1fr)_110px] sm:items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-sm font-semibold text-[var(--text-secondary)]">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--text-primary)]">{module.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {t(module.lessonType)}
                    {module.videoUrl ? ` • ${t('videoLesson')}` : ''}
                    {module.quiz.length > 0 ? ` • ${t('knowledgeCheck')}` : ''}
                  </p>
                </div>
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  {canAccess ? t('available') : t('locked')}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

    </>
  )
}

function CourseMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--bg-primary)] p-3">
      <p className="mb-1 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
        {icon}
        {label}
      </p>
      <p className="text-sm font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  )
}
