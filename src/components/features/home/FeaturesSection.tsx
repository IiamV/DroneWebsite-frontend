'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Layers, Download, ArrowRight } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { ROUTES, localePath } from '@/constants/routes'
import type { LucideIcon } from 'lucide-react'

const cardVariants = {
  hidden:   { opacity: 0, y: 24 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
}

export function FeaturesSection() {
  const t = useTranslations('features')
  const locale = useLocale()

  const features: { icon: LucideIcon; title: string; description: string; href?: string; highlight?: boolean }[] = [
    {
      icon: Download,
      title: t('downloads'),
      description: t('downloadsDesc'),
      href: localePath(locale, ROUTES.DOWNLOADS),
      highlight: true,
    },
    {
      icon: Layers,
      title: t('catalog'),
      description: 'Browse complete drone builds — see specs, components, and assembly guides.',
      href: localePath(locale, ROUTES.CATALOG),
    },
  ]

  return (
    <section className="px-6 py-20 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-3">
          {t('title')}
        </h2>
        <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-base">
          Everything you need to go from zero to flying — in one platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
        {features.map((feature) => {
          const Icon = feature.icon
          const card = (
            <motion.div
              key={feature.title}
              className={[
                'group relative flex flex-col gap-4 p-6 rounded-2xl border transition-all h-full',
                feature.highlight
                  ? 'border-[var(--accent)]/40 bg-gradient-to-br from-[var(--accent)]/8 to-[var(--bg-secondary)] hover:border-[var(--accent)]/70'
                  : 'border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]/30',
              ].join(' ')}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {/* {feature.highlight && (
                <span className="absolute top-4 right-4 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--bg-primary)] uppercase tracking-wide">
                  New
                </span>
              )} */}
              <div className={[
                'w-11 h-11 rounded-xl flex items-center justify-center border',
                feature.highlight
                  ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]'
                  : 'bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-primary)]',
              ].join(' ')}>
                <Icon size={20} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-[var(--text-primary)] mb-1.5">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{feature.description}</p>
              </div>
              {feature.href && (
                <div className="flex items-center gap-1 text-xs font-semibold text-[var(--accent)] group-hover:gap-2 transition-all">
                  {feature.highlight ? 'Download now' : 'Learn more'}
                  <ArrowRight size={12} aria-hidden="true" />
                </div>
              )}
            </motion.div>
          )

          return feature.href ? (
            <Link key={feature.title} href={feature.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-2xl">
              {card}
            </Link>
          ) : (
            <div key={feature.title}>{card}</div>
          )
        })}
      </div>
    </section>
  )
}
