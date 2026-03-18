'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

const DroneCanvas = dynamic(
  () => import('./DroneCanvas'),
  { ssr: false, loading: () => <DronePlaceholder /> }
)

function DronePlaceholder() {
  return (
    <div className="w-full h-full bg-[var(--bg-secondary)] rounded-xl animate-pulse" />
  )
}

const headline = 'Master Drone Technology From the Ground Up'.split(' ')

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const word = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
}

export function HeroSection() {
  return (
    <section className="relative flex flex-col-reverse md:flex-row items-center gap-8 px-6 py-16 md:py-24 max-w-7xl mx-auto">
      {/* Text */}
      <div className="flex-1 flex flex-col gap-6">
        <motion.h1
          className="text-4xl md:text-6xl font-bold leading-tight flex flex-wrap gap-x-3"
          variants={container}
          initial="hidden"
          animate="show"
          aria-label={headline.join(' ')}
        >
          {headline.map((w, i) => (
            <motion.span key={i} variants={word}>
              {w}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="text-lg text-[var(--text-secondary)] max-w-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          Explore interactive 3D simulations, browse drone components, and unlock
          premium courses — all in one platform.
        </motion.p>

        <motion.div
          className="flex gap-4 flex-wrap"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <Link
            href={ROUTES.SUBSCRIPTION}
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-3 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold touch-manipulation hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
          <Link
            href={ROUTES.COURSES}
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-3 rounded-lg border border-[var(--border)] font-semibold touch-manipulation hover:bg-[var(--bg-secondary)] transition-colors"
          >
            Browse Courses
          </Link>
        </motion.div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 w-full h-64 md:h-[480px]">
        <DroneCanvas />
      </div>
    </section>
  )
}
