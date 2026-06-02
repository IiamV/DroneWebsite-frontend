'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, DollarSign, Wrench, ChevronRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { ROUTES, localePath } from '@/constants/routes'
import { mediaUrl } from '@/lib/media-url'
import type { DroneBuild } from '@/types'

const DIFFICULTY_COLORS: Record<DroneBuild['difficulty'], string> = {
  beginner:     '#22c55e',
  intermediate: '#f59e0b',
  advanced:     '#ef4444',
}

interface BuildCardProps {
  build: DroneBuild
  locale?: string
}

export function BuildCard({ build, locale: localeProp }: BuildCardProps) {
  const localeHook = useLocale()
  const locale = localeProp ?? localeHook
  const t = useTranslations('builds')
  const [imgErr, setImgErr] = useState(false)

  return (
    <Link
      href={localePath(locale, `${ROUTES.CATALOG}/${build.slug}`)}
      className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden hover:border-[var(--accent)] transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-[var(--bg-primary)] overflow-hidden">
        {build.thumbnailUrl && !imgErr ? (
          <Image
            src={mediaUrl(build.thumbnailUrl)}
            alt={build.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Wrench size={48} className="text-[var(--text-secondary)] opacity-30" aria-hidden="true" />
          </div>
        )}
        {/* Difficulty badge */}
        <span
          className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full text-white"
          style={{ backgroundColor: DIFFICULTY_COLORS[build.difficulty] }}
        >
          {t(build.difficulty)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-bold text-[var(--text-primary)] text-base leading-tight group-hover:text-[var(--accent)] transition-colors">
            {build.name}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
            {build.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1">
            <Clock size={11} aria-hidden="true" />
            {build.flightTime}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign size={11} aria-hidden="true" />
            ~${build.estimatedCost}
          </span>
          <span className="flex items-center gap-1">
            <Wrench size={11} aria-hidden="true" />
            {build.steps.length} {t('assemblySteps')}
          </span>
        </div>

        {/* Use case tag */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border)]">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border)]">
            {build.useCase}
          </span>
          <span className="flex items-center gap-0.5 text-[11px] font-semibold text-[var(--accent)] group-hover:gap-1.5 transition-all">
            {t('view3d')} <ChevronRight size={13} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  )
}
