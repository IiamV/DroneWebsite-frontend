'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Package, Plus, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
  inBuild?: boolean
  onToggleBuild?: (id: string) => void
}

export const ProductCard = memo(function ProductCard({ product, inBuild = false, onToggleBuild }: ProductCardProps) {
  return (
    <div className="group relative rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden hover:border-[var(--accent)] transition-colors">
      <Link
        href={`${ROUTES.CATALOG}/${product.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <div className="relative h-40 bg-[var(--bg-primary)] flex items-center justify-center border-b border-[var(--border)] text-[var(--text-secondary)]">
          <Package size={44} aria-hidden="true" />
          <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-hidden="true">
            <p className="product-card-summary w-full rounded-md px-2 py-1.5 text-xs text-white leading-snug">
              {product.shortSummary}
            </p>
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge variant="outline" style={{ borderColor: CATEGORY_COLORS[product.category], color: CATEGORY_COLORS[product.category] }}>
              {CATEGORY_LABELS[product.category]}
            </Badge>
            <span className="text-xs text-[var(--text-secondary)]">{product.brand}</span>
          </div>
          <h3 className="font-semibold text-[var(--text-primary)] line-clamp-2 text-sm">{product.name}</h3>
        </div>
      </Link>

      {onToggleBuild && (
        <div className="px-3 pb-3">
          <button
            onClick={() => onToggleBuild(product.id)}
            aria-label={inBuild ? `Remove ${product.name} from build` : `Add ${product.name} to build`}
            aria-pressed={inBuild}
            className={[
              'w-full flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors border',
              inBuild
                ? 'bg-[var(--accent)] text-[var(--bg-primary)] border-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]',
            ].join(' ')}
          >
            {inBuild ? <Check size={12} /> : <Plus size={12} />}
            {inBuild ? 'In build' : 'Add to build'}
          </button>
        </div>
      )}
    </div>
  )
})
