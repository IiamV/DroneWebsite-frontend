'use client'

import { Lock } from 'lucide-react'
import { useState } from 'react'
import { ModuleSidebar } from './ModuleSidebar'
import { CoursePlayer } from './CoursePlayer'
import { UpgradeModal } from '@/components/features/subscription/UpgradeModal'
import { Badge } from '@/components/ui/badge'
import type { Course, Subscription, SubscriptionTier } from '@/types'
import { TIER_RANK } from '@/constants/tiers'

const DIFFICULTY_COLORS: Record<Course['difficulty'], string> = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

interface CourseDetailClientProps {
  course: Course
  subscription: Subscription | null
  tiers: SubscriptionTier[]
}

export function CourseDetailClient({ course, subscription, tiers }: CourseDetailClientProps) {
  const sorted = [...course.modules].sort((a, b) => a.order - b.order)
  const [activeModuleId, setActiveModuleId] = useState(sorted[0]?.id ?? '')
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  const userTierRank = subscription?.status === 'active'
    ? (TIER_RANK[subscription.tierId] ?? 0)
    : 0
  const requiredRank = TIER_RANK[course.requiredTier] ?? 0
  const hasAccess = userTierRank >= requiredRank

  const activeModule = sorted.find((m) => m.id === activeModuleId) ?? sorted[0]
  const requiredTier = tiers.find((t) => t.id === course.requiredTier)
  const currentTierId = subscription?.tierId

  const durationHours = Math.floor(course.durationMinutes / 60)
  const durationMins = course.durationMinutes % 60
  const durationLabel = durationHours > 0
    ? `${durationHours}h ${durationMins > 0 ? `${durationMins}m` : ''}`.trim()
    : `${durationMins}m`

  return (
    <>
      {/* Course header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="outline" style={{ borderColor: DIFFICULTY_COLORS[course.difficulty], color: DIFFICULTY_COLORS[course.difficulty] }}>
            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
          </Badge>
          <span className="text-sm text-[var(--text-secondary)] capitalize">{course.category}</span>
          <span className="text-sm text-[var(--text-secondary)]">·</span>
          <span className="text-sm text-[var(--text-secondary)]">{durationLabel}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">{course.title}</h1>
        <p className="text-[var(--text-secondary)]">{course.description}</p>
      </div>

      {hasAccess ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
              <ModuleSidebar
                modules={course.modules}
                activeModuleId={activeModuleId}
                onSelectModule={setActiveModuleId}
              />
            </div>
          </aside>

          {/* Content */}
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
            {requiredTier ? `${requiredTier.name} plan required` : 'Upgrade required'}
          </h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
            This course requires a higher subscription tier. Upgrade to unlock all modules.
          </p>
          <button
            onClick={() => setUpgradeOpen(true)}
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 rounded-md bg-[var(--accent)] text-[var(--bg-primary)] font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{ touchAction: 'manipulation' }}
          >
            View upgrade options
          </button>
        </div>
      )}

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        currentTierId={currentTierId}
        requiredTier={requiredTier}
      />
    </>
  )
}
