'use client'

import { memo, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import type { Product } from '@/types'
import { ROUTES } from '@/constants/routes'

const CATEGORY_COLORS: Record<Product['category'], string> = {
  frame: '#6366f1',
  motor: '#f59e0b',
  esc: '#10b981',
  flight_controller: '#3b82f6',
  propeller: '#8b5cf6',
  battery: '#ef4444',
  camera: '#ec4899',
  complete_drone: '#0ea5e9',
}

const CATEGORY_LABELS: Record<Product['category'], string> = {
  frame: 'Frame',
  motor: 'Motor',
  esc: 'ESC',
  flight_controller: 'Flight Controller',
  propeller: 'Propeller',
  battery: 'Battery',
  camera: 'Camera',
  complete_drone: 'Complete Drone',
}

interface ProductCardProps {
  product: Product
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const [summaryVisible, setSummaryVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Touch: tap to reveal summary; tap outside (focusout leaving card) to dismiss
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation()
    setSummaryVisible((v) => !v)
  }, [])

  const handleBlur = useCallback((e: React.FocusEvent) => {
    if (!cardRef.current?.contains(e.relatedTarget as Node)) {
      setSummaryVisible(false)
    }
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group relative"
      onTouchStart={handleTouchStart}
      onBlur={handleBlur}
    >
      <Link
        href={`${ROUTES.CATALOG}/${product.slug}`}
        className="block rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden hover:border-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={{ touchAction: 'manipulation' }}
      >
        {/* Thumbnail with hover/touch summary overlay */}
        <div className="relative h-44 bg-[var(--bg-primary)] flex items-center justify-center border-b border-[var(--border)] overflow-hidden">
          <span className="text-5xl select-none">🚁</span>

          {/*
            Summary overlay:
            - Desktop: shown on CSS :hover via group-hover (no JS needed)
            - Touch: shown when summaryVisible state is true
            @supports backdrop-filter: uses blur; fallback: solid dark bg
          */}
          <div
            className={[
              'absolute inset-0 flex items-end p-3 transition-opacity duration-200',
              summaryVisible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
            ].join(' ')}
            aria-hidden="true"
          >
            {/* @supports backdrop-filter fallback via CSS class in globals.css */}
            <p className="product-card-summary w-full rounded-md px-2 py-1.5 text-xs text-white leading-snug">
              {product.shortSummary}
            </p>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge
              color={CATEGORY_COLORS[product.category]}
              label={CATEGORY_LABELS[product.category]}
            />
            <span className="text-xs text-[var(--text-secondary)]">{product.brand}</span>
          </div>

          <h3 className="font-semibold text-[var(--text-primary)] mb-1 line-clamp-2 text-sm">
            {product.name}
          </h3>

          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
})
