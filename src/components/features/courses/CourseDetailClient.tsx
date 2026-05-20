'use client'

import { Lock } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ModuleSidebar } from './ModuleSidebar'
import { CoursePlayer } from './CoursePlayer'
import { UpgradeModal } from '@/components/features/subscription/UpgradeModal'
import { Badge } from '@/components/ui/badge'
import { useSubscription } from '@/hooks/useSubscription'
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

  const sorted = [...course.modules].sort((a, b) => a.order - b.order)
  const [activeModuleId, setActiveModuleId] = useState(sorted[0]?.id ?? '')
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  // Live subscription state from Supabase
  const { tierRank, hasAccess, subscription, loading } = useSubscription(tiers)

  const requiredTier = tiers.find((tier) => tier.id === course.requiredTier)
  const requiredRank = requiredTier?.tierRank ?? 0
  const canAccess = !loading && hasAccess(course.requiredTier, tiers)
  const activeModule = sorted.find((m) => m.id === activeModuleId) ?? sorted[0]

  const durationHours = Math.floor(course.durationMinutes / 60)
  const durationMins = course.durationMinutes % 60
  const durationLabel = durationHours > 0
    ? `${durationHours}h ${durationMins > 0 ? `${durationMins}m` : ''}`.trim()
    : `${durationMins}m`

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="outline" style={{ borderColor: DIFFICULTY_COLORS[course.difficulty], color: DIFFICULTY_COLORS[course.difficulty] }}>
            {tc(course.difficulty)}
          </Badge>
          <span className="text-sm text-[var(--text-secondary)] capitalize">{course.category}</span>
          <span className="text-sm text-[var(--text-secondary)]">·</span>
          <span className="text-sm text-[var(--text-secondary)]">{durationLabel}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">{course.title}</h1>
        <p className="text-[var(--text-secondary)]">{course.description}</p>
      </div>

      {loading ? (
        <div className="h-64 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] animate-pulse" />
      ) : canAccess ? (
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 shrink-0">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
              <ModuleSidebar
                modules={course.modules}
                activeModuleId={activeModuleId}
                onSelectModule={setActiveModuleId}
              />
            </div>
          </aside>
          <div className="flex-1 min-w-0 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            {activeModule && <CoursePlayer module={activeModule} />}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)]">
              <Lock size={24} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            {requiredTier ? t('planRequired', { plan: requiredTier.name }) : t('upgradeRequired')}
          </h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
            {t('upgradeMessage')}
          </p>
          <button
            onClick={() => setUpgradeOpen(true)}
            className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-md bg-[var(--accent)] text-[var(--bg-primary)] font-medium hover:opacity-90 transition-opacity"
          >
            {t('viewUpgrade')}
          </button>
        </div>
      )}

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        tiers={tiers}
        currentTierId={subscription?.tierId}
        requiredTier={requiredTier}
      />
    </>
  )
}
