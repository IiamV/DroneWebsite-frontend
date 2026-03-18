'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

export function CTASection() {
  return (
    <section className="px-6 py-20">
      <motion.div
        className="max-w-3xl mx-auto text-center flex flex-col gap-6 p-10 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to take flight?
        </h2>
        <p className="text-[var(--text-secondary)] text-lg">
          Choose a plan and unlock full access to courses, simulations, and
          downloadable software.
        </p>
        <div className="flex justify-center">
          <Link
            href={ROUTES.SUBSCRIPTION}
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-8 py-3 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold touch-manipulation hover:opacity-90 transition-opacity"
          >
            View Plans
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
