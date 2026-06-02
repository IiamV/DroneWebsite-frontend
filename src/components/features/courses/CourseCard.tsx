'use client'

import { memo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Cpu, LockKeyhole, Unlock } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import type { Course } from '@/types'
import { ROUTES, localePath } from '@/constants/routes'

const DIFFICULTY_COLORS: Record<Course['difficulty'], string> = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

interface CourseCardProps {
  course: Course
}

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

function CourseThumbnail({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false)
  if (errored) return <Cpu size={40} aria-hidden="true" />
  return (
    <Image
      src={`${base}${src}`}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover"
      onError={() => setErrored(true)}
    />
  )
}

export const CourseCard = memo(function CourseCard({ course }: CourseCardProps) {
  const locale = useLocale()
  const t = useTranslations('courses')
  const durationHours = Math.floor(course.durationMinutes / 60)
  const durationMins = course.durationMinutes % 60
  const durationLabel = durationHours > 0
    ? `${durationHours}h ${durationMins > 0 ? `${durationMins}m` : ''}`.trim()
    : `${durationMins}m`
  const isFree = course.requiredTier === 'free'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={localePath(locale, `${ROUTES.COURSES}/${course.slug}`)}
        className="group grid overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:grid-cols-[210px_minmax(0,1fr)]"
        style={{ touchAction: 'manipulation' }}
      >
        <div className="relative min-h-40 overflow-hidden border-b border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)] sm:border-b-0 sm:border-r">
          {course.thumbnailUrl
            ? <CourseThumbnail src={course.thumbnailUrl} alt={course.title} />
            : (
              <div className="flex h-full min-h-40 items-center justify-center">
                <Cpu size={40} aria-hidden="true" />
              </div>
            )
          }
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_150px] sm:p-5">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" style={{ borderColor: DIFFICULTY_COLORS[course.difficulty], color: DIFFICULTY_COLORS[course.difficulty] }}>
                {t(course.difficulty)}
              </Badge>
              <Badge variant={isFree ? 'secondary' : 'outline'}>
                <span className="inline-flex items-center gap-1">
                  {isFree ? <Unlock size={12} aria-hidden="true" /> : <LockKeyhole size={12} aria-hidden="true" />}
                  {isFree ? t('free') : t('subscriber')}
                </span>
              </Badge>
              <span className="text-xs text-[var(--text-secondary)] capitalize">{course.category}</span>
            </div>

            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              {t('provider')}
            </p>
            <h3 className="mb-2 text-base font-semibold leading-snug text-[var(--text-primary)] group-hover:underline">
              {course.title}
            </h3>
            <p className="line-clamp-2 text-sm text-[var(--text-secondary)]">
              {course.description}
            </p>
          </div>

          <div className="flex flex-row gap-4 text-xs text-[var(--text-secondary)] sm:flex-col sm:items-start sm:justify-center sm:border-l sm:border-[var(--border)] sm:pl-5">
            <span>
              <strong className="block text-sm text-[var(--text-primary)]">{durationLabel}</strong>
              {t('duration')}
            </span>
            <span>
              <strong className="block text-sm text-[var(--text-primary)]">{isFree ? t('free') : t('subscriber')}</strong>
              {t('access')}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
})
