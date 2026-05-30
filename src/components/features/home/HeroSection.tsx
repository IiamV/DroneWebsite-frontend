'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Download, BookOpen, ChevronRight, Play } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { ROUTES, localePath } from '@/constants/routes'
import { useState } from 'react'

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

// ── Placeholder image component ────────────────────────────────────────────
function PlaceholderImage({
  label,
  aspectRatio = 'aspect-video',
  className = '',
}: {
  label: string
  aspectRatio?: string
  className?: string
}) {
  return (
    <div
      className={`${aspectRatio} ${className} flex flex-col items-center justify-center gap-2 bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--text-secondary)] select-none`}
    >
      <div className="w-10 h-10 rounded-lg bg-[var(--border)] flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
      <p className="text-xs font-medium">{label}</p>
    </div>
  )
}

export function HeroSection() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const [gifLoaded, setGifLoaded] = useState(false)

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(99,102,241,0.15) 0%, transparent 65%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-8 md:pt-28 md:pb-12 text-center">

          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-xs font-semibold text-[var(--text-secondary)] mb-8"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
            Drone Application by Insai — v1.0 Available Now
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-[4.5rem] font-extrabold leading-[1.08] tracking-tight text-[var(--text-primary)] mb-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Build, simulate, and fly drones — all in one IDE
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            Assemble drones from real market components, run physics simulations, analyse flight statistics, and export your build — before touching a single piece of hardware.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 mb-16"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href={localePath(locale, ROUTES.DOWNLOADS)}
              className="inline-flex items-center gap-2 min-h-[48px] px-7 py-3 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
              <Download size={15} aria-hidden="true" />
              Download free
            </Link>
            <Link
              href={localePath(locale, ROUTES.DOCS)}
              className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3 rounded-xl border border-[var(--border)] font-semibold text-sm hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <BookOpen size={15} aria-hidden="true" />
              Tutorial
              <ChevronRight size={13} className="opacity-60" aria-hidden="true" />
            </Link>
            <Link
              href={localePath(locale, ROUTES.SUBSCRIPTION)}
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              View plans
            </Link>
          </motion.div>

          {/* GIF / screenshot showcase */}
          <motion.div
            className="relative mx-auto max-w-5xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            {/* Glow */}
            <div
              className="absolute -inset-6 rounded-3xl blur-3xl opacity-15 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 50%, #10b981 100%)' }}
              aria-hidden="true"
            />

            <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] shadow-2xl bg-[#0d0d0d]">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#161616]">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" aria-hidden="true" />
                <span className="ml-4 text-xs text-white/40 font-mono">Drone Application by Insai — Build Simulator</span>
              </div>

              {/* GIF — drop /public/images/home/ide-demo.gif to activate */}
              <div className="relative aspect-[16/9]">
                <img
                  src={`${base}/images/home/ide-demo.gif`}
                  alt="Drone Application by Insai IDE demo"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                {/* Fallback placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0d0d0d] text-white/30">
                  <div className="w-20 h-20 rounded-2xl border border-white/10 flex items-center justify-center">
                    <Play size={32} className="ml-1" aria-hidden="true" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-white/50">IDE Demo</p>
                    <p className="text-xs mt-1">Drop <code className="bg-white/10 px-1 rounded">ide-demo.gif</code> into <code className="bg-white/10 px-1 rounded">/public/images/home/</code></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats below */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { value: '3',    label: 'Platforms',   sub: 'Windows · macOS · Linux' },
                { value: 'Free', label: 'to download', sub: 'Basic plan required' },
                { value: '∞',    label: 'Simulations', sub: 'Unlimited virtual flights' },
              ].map((s) => (
                <div key={s.label} className="text-center p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                  <p className="text-2xl font-extrabold text-[var(--text-primary)]">{s.value}</p>
                  <p className="text-xs font-semibold text-[var(--text-primary)] mt-0.5">{s.label}</p>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Feature showcase ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24 space-y-32">

        {/* Feature 1 — Build */}
        <FeatureRow
          eyebrow="Build"
          title="Assemble from real market components"
          description="Browse the full catalog of motors, ESCs, flight controllers, frames, batteries, and cameras. Drag components onto the 3D canvas, wire them together, and see your drone take shape in real time."
          imageSrc={`${base}/images/home/feature-build.png`}
          imageAlt="Drone builder interface"
          imageLeft={false}
          delay={0}
        />

        {/* Feature 2 — Statistics */}
        <FeatureRow
          eyebrow="Statistics"
          title="Instant performance analytics"
          description="See estimated flight time, thrust-to-weight ratio, total power draw, and component weight breakdown — all calculated automatically as you build. Know your drone's limits before it ever leaves the ground."
          imageSrc={`${base}/images/home/feature-stats.png`}
          imageAlt="Drone statistics panel"
          imageLeft={true}
          delay={0.1}
        />

        {/* Feature 3 — Simulate */}
        <FeatureRow
          eyebrow="Simulate"
          title="Physics-accurate flight simulation"
          description="Run your build through a full physics simulation. Test hover stability, throttle response, and crash scenarios in a safe virtual environment. Tune PID values and see the effect instantly."
          imageSrc={`${base}/images/home/feature-simulate.png`}
          imageAlt="Flight simulation view"
          imageLeft={false}
          delay={0.1}
        />

        {/* Feature 4 — Export */}
        <FeatureRow
          eyebrow="Export"
          title="Export your build, ready to order"
          description="Generate a complete parts list with affiliate links, wiring diagrams, and a step-by-step assembly guide. Share your build or order the components directly — everything you need to go from screen to sky."
          imageSrc={`${base}/images/home/feature-export.png`}
          imageAlt="Build export and parts list"
          imageLeft={true}
          delay={0.1}
        />
      </section>
    </>
  )
}

// ── Feature row component ──────────────────────────────────────────────────
function FeatureRow({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  imageLeft,
  delay,
}: {
  eyebrow: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  imageLeft: boolean
  delay: number
}) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

  return (
    <motion.div
      className={`flex flex-col ${imageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-16`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay }}
    >
      {/* Text */}
      <div className="flex-1 space-y-4">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--accent)] px-3 py-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/8">
          {eyebrow}
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] leading-tight">
          {title}
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed text-base">
          {description}
        </p>
      </div>

      {/* Image / placeholder */}
      <div className="flex-1 w-full">
        <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] shadow-xl bg-[var(--bg-secondary)] aspect-[4/3]">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          {/* Fallback */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[var(--text-secondary)]">
            <div className="w-12 h-12 rounded-xl border-2 border-dashed border-[var(--border)] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>
            <p className="text-xs font-medium">{imageAlt}</p>
            <p className="text-[10px] opacity-60">
              Drop <code className="bg-[var(--border)] px-1 rounded">{imageSrc.split('/').pop()}</code> into <code className="bg-[var(--border)] px-1 rounded">/public/images/home/</code>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
