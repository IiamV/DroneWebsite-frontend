'use client'

import { motion } from 'framer-motion'
import { Box, BookOpen, Layers, Download } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Box,
    title: '3D Drone Simulation',
    description:
      'Visualise and test drone configurations in real-time with our WebGL-powered simulator.',
  },
  {
    icon: BookOpen,
    title: 'Expert-Led Courses',
    description:
      'Learn from beginner to advanced with structured courses covering flight mechanics, electronics, and software.',
  },
  {
    icon: Layers,
    title: 'Component Catalog',
    description:
      'Browse drone parts with smart compatibility filtering to plan your perfect build.',
  },
  {
    icon: Download,
    title: 'Simulation Software',
    description:
      'Download the Drone Application by Insai IDE and fly virtual missions before touching real hardware.',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
}

export function FeaturesSection() {
  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 text-[var(--text-primary)]">
        Everything you need to master drones
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              className="flex flex-col gap-3 p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)]">
                <Icon size={20} aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-lg text-[var(--text-primary)]">{feature.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
