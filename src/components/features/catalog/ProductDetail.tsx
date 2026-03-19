'use client'

import { useState } from 'react'
import { Package, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CompatibilityPanel } from './CompatibilityPanel'
import type { Product } from '@/types'

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

interface ProductDetailProps {
  product: Product
  compatibleProducts: Product[]
}

export function ProductDetail({ product, compatibleProducts }: ProductDetailProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  return (
    <div className="space-y-12">
      {/* Top section: gallery + info */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image gallery */}
        <div className="lg:w-1/2 space-y-3">
          {/* Main image */}
          <div className="aspect-square rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden text-[var(--text-secondary)]">
            <Package size={80} aria-label={product.name} />
          </div>

          {/* Thumbnails */}
          {product.imageUrls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Product images">
              {product.imageUrls.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={[
                    'shrink-0 w-16 h-16 rounded border-2 bg-[var(--bg-secondary)] flex items-center justify-center transition-colors',
                    'min-h-[44px] min-w-[44px]',
                    activeImageIndex === i
                      ? 'border-[var(--accent)]'
                      : 'border-[var(--border)] hover:border-[var(--accent)]',
                  ].join(' ')}
                  style={{ touchAction: 'manipulation' }}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={activeImageIndex === i}
                >
                  <Package size={18} aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="lg:w-1/2 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" style={{ borderColor: CATEGORY_COLORS[product.category], color: CATEGORY_COLORS[product.category] }}>
              {CATEGORY_LABELS[product.category]}
            </Badge>
            <span className="text-sm text-[var(--text-secondary)]">{product.brand}</span>
          </div>

          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">{product.name}</h1>

          <p className="text-[var(--text-secondary)] leading-relaxed">{product.description}</p>

          {/* Features */}
          <div>
            <h2 className="font-semibold text-[var(--text-primary)] mb-2">Features</h2>
            <ul className="space-y-1" role="list">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                  <Check size={14} className="text-[var(--accent)] mt-0.5 shrink-0" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {product.affiliateUrl && (
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md px-4 font-medium transition-colors min-h-[44px] bg-[var(--accent)] text-[var(--bg-primary)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{ touchAction: 'manipulation' }}
            >
              Buy / View Product ↗
            </a>
          )}
        </div>
      </div>

      {/* Specs table */}
      <section aria-label="Product specifications">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Specifications</h2>
        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(product.specs).map(([key, value], i) => (
                <tr
                  key={key}
                  className={i % 2 === 0 ? 'bg-[var(--bg-secondary)]' : 'bg-[var(--bg-primary)]'}
                >
                  <th
                    scope="row"
                    className="px-4 py-3 text-left font-medium text-[var(--text-primary)] w-1/3"
                  >
                    {key}
                  </th>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Compatibility panel */}
      <CompatibilityPanel compatibleProducts={compatibleProducts} />
    </div>
  )
}
