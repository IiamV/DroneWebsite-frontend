'use client'

import { memo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import type { Course } from '@/types'
import { ROUTES } from '@/constants/routes'

const DIFFICULTY_COLORS: Record<Course['difficulty'], string> = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

interface CourseCardProps {
  course: Course
}

export const CourseCard = memo(function CourseCard({ course }: CourseCardProps) {
  const durationHours = Math.floor(course.durationMinutes / 60)
  const durationMins = course.durationMinutes % 60
  const durationLabel = durationHours > 0
    ? `${durationHours}h ${durationMins > 0 ? `${durationMins}m` : ''}`.trim()
    : `${durationMins}m`

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`${ROUTES.COURSES}/${course.slug}`}
        className="block rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden hover:border-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={{ touchAction: 'manipulation' }}
      >
        {/* Thumbnail placeholder */}
        <div className="h-40 bg-[var(--bg-primary)] flex items-center justify-center border-b border-[var(--border)]">
          <span className="text-4xl">🚁</span>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge
              color={DIFFICULTY_COLORS[course.difficulty]}
              label={course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            />
            <span className="text-xs text-[var(--text-secondary)] capitalize">{course.category}</span>
          </div>

          <h3 className="font-semibold text-[var(--text-primary)] mb-1 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
            {course.description}
          </p>

          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>{course.modules.length} modules</span>
            <span>{durationLabel}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
})
