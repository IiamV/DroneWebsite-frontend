'use client'

import { ArrowLeft, ArrowRight, CheckCircle2, Lock } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { CoursePlayer } from './CoursePlayer'
import { ModuleSidebar } from './ModuleSidebar'
import { useSubscription } from '@/hooks/useSubscription'
import { ROUTES, localePath } from '@/constants/routes'
import { createClient } from '@/lib/supabase/client'
import type { Course, SubscriptionTier } from '@/types'

interface CourseMaterialClientProps {
  course: Course
  tiers: SubscriptionTier[]
}

export function CourseMaterialClient({ course, tiers }: CourseMaterialClientProps) {
  const t = useTranslations('courseDetail')
  const locale = useLocale()
  const sorted = useMemo(() => [...course.modules].sort((a, b) => a.order - b.order), [course.modules])
  const [activeIndex, setActiveIndex] = useState(0)
  const [completedModuleIds, setCompletedModuleIds] = useState<Set<string>>(new Set())
  const [savingProgress, setSavingProgress] = useState(false)
  const [progressError, setProgressError] = useState<string | null>(null)
  const { hasAccess, loading } = useSubscription(tiers)

  const requiredTier = tiers.find((tier) => tier.id === course.requiredTier)
  const canAccess = course.requiredTier === 'free' || (!loading && hasAccess(course.requiredTier, tiers))
  const activeModule = sorted[activeIndex]
  const courseHref = localePath(locale, `${ROUTES.COURSES}/${course.slug}`)
  const coursesHref = localePath(locale, ROUTES.COURSES)
  const pricingHref = localePath(locale, ROUTES.PRICING)
  const progress = sorted.length > 0 ? (completedModuleIds.size / sorted.length) * 100 : 0
  const activeModuleCompleted = activeModule ? completedModuleIds.has(activeModule.id) : false

  useEffect(() => {
    if (!canAccess || sorted.length === 0) return

    let cancelled = false

    async function loadProgress() {
      const supabase = createClient()
      const { data: authData } = await supabase.auth.getUser()
      if (!authData.user) return

      const { data, error } = await (supabase
        .from('course_progress') as any)
        .select('module_id')
        .eq('user_id', authData.user.id)
        .eq('course_id', course.id)
        .eq('completed', true)

      if (!cancelled && !error) {
        setCompletedModuleIds(new Set((data ?? []).map((row: Record<string, string>) => row.module_id)))
      }
    }

    loadProgress()

    return () => {
      cancelled = true
    }
  }, [canAccess, course.id, sorted.length])

  function selectModule(moduleId: string) {
    const nextIndex = sorted.findIndex((module) => module.id === moduleId)
    if (nextIndex >= 0) setActiveIndex(nextIndex)
  }

  async function markActiveModuleComplete() {
    if (!activeModule || activeModuleCompleted || savingProgress) return

    setSavingProgress(true)
    setProgressError(null)

    const nextCompleted = new Set(completedModuleIds)
    nextCompleted.add(activeModule.id)
    const nextProgress = sorted.length > 0 ? Math.round((nextCompleted.size / sorted.length) * 100) : 0
    const supabase = createClient()

    try {
      const { data: authData } = await supabase.auth.getUser()
      if (!authData.user) {
        setProgressError(t('signInToSaveProgress'))
        return
      }

      const { data: existingRows, error: existingError } = await (supabase
        .from('course_progress') as any)
        .select('id')
        .eq('user_id', authData.user.id)
        .eq('course_id', course.id)
        .eq('module_id', activeModule.id)
        .limit(1)

      if (existingError) throw existingError

      const payload = {
        completed: true,
        progress_percent: nextProgress,
        updated_at: new Date().toISOString(),
      }

      const existing = existingRows?.[0]
      const { error } = existing
        ? await (supabase.from('course_progress') as any).update(payload).eq('id', existing.id)
        : await (supabase.from('course_progress') as any).insert({
            ...payload,
            user_id: authData.user.id,
            course_id: course.id,
            module_id: activeModule.id,
          })

      if (error) throw error
      setCompletedModuleIds(nextCompleted)
    } catch {
      setProgressError(t('progressSaveFailed'))
    } finally {
      setSavingProgress(false)
    }
  }

  if (loading && course.requiredTier !== 'free') {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="h-80 animate-pulse rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]" />
      </main>
    )
  }

  if (!canAccess) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-10 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)]">
              <Lock size={24} />
            </div>
          </div>
          <h1 className="mb-2 text-xl font-bold text-[var(--text-primary)]">
            {requiredTier ? t('planRequired', { plan: requiredTier.name }) : t('upgradeRequired')}
          </h1>
          <p className="mx-auto mb-6 max-w-md text-[var(--text-secondary)]">{t('upgradeMessage')}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={coursesHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-primary)] px-5 text-sm font-semibold text-[var(--text-primary)]"
            >
              {t('backToCourses')}
            </Link>
            <Link
              href={courseHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-primary)] px-5 text-sm font-semibold text-[var(--text-primary)]"
            >
              {t('backToEnroll')}
            </Link>
            <Link
              href={pricingHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--bg-primary)]"
            >
              {t('viewUpgrade')}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-5 flex flex-col gap-3 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap gap-4">
            <Link href={coursesHref} className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <ArrowLeft size={16} aria-hidden="true" />
              {t('backToCourses')}
            </Link>
            <Link href={courseHref} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              {t('backToEnroll')}
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{course.title}</h1>
          {activeModule && (
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {t('moduleProgress', { current: activeIndex + 1, total: sorted.length })}: {activeModule.title}
            </p>
          )}
        </div>
        <div className="min-w-[220px]">
          <div className="mb-1 flex justify-between text-xs text-[var(--text-secondary)]">
            <span>{t('courseProgress')}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            {t('completedModuleCount', { completed: completedModuleIds.size, total: sorted.length })}
          </p>
        </div>
      </div>

      {activeModule ? (
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
              <ModuleSidebar
                modules={sorted}
                activeModuleId={activeModule.id}
                onSelectModule={selectModule}
                completedModuleIds={completedModuleIds}
              />
            </div>
          </aside>

          <section className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4 sm:p-6">
            <CoursePlayer module={activeModule} />
            <div className="mt-8 flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {activeModuleCompleted ? t('moduleComplete') : t('markModuleComplete')}
                </p>
                {progressError && <p className="mt-1 text-sm text-red-500">{progressError}</p>}
              </div>
              <button
                type="button"
                onClick={markActiveModuleComplete}
                disabled={activeModuleCompleted || savingProgress}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--bg-primary)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 size={16} aria-hidden="true" />
                {activeModuleCompleted ? t('moduleComplete') : savingProgress ? t('savingProgress') : t('markModuleComplete')}
              </button>
            </div>
            <div className="mt-8 flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
                disabled={activeIndex === 0}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-primary)] px-4 text-sm font-semibold text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                {t('previousModule')}
              </button>
              <span className="text-center text-sm text-[var(--text-secondary)]">
                {t('moduleProgress', { current: activeIndex + 1, total: sorted.length })}
              </span>
              <button
                type="button"
                onClick={() => setActiveIndex((current) => Math.min(sorted.length - 1, current + 1))}
                disabled={activeIndex >= sorted.length - 1}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--bg-primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('nextModule')}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </section>
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-10 text-center text-[var(--text-secondary)]">
          {t('contentLockedMessage')}
        </div>
      )}
    </main>
  )
}
