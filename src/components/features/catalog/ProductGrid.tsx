'use client'

import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { AssemblyFilter } from './AssemblyFilter'
import { filterCompatibleProducts } from '@/lib/compatibility'
import type { Product } from '@/types'

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

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [search, setSearch] = useState('')

  const categories = Array.from(new Set(products.map((p) => p.category))) as Product['category'][]

  const toggleProduct = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }, [])

  const clearFilter = useCallback(() => setSelectedIds([]), [])

  const compatible = filterCompatibleProducts(selectedIds, products)

  const displayed = compatible.filter((p) => {
    if (categoryFilter && p.category !== categoryFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortSummary.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    return true
  })

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <AssemblyFilter
        products={products}
        selectedIds={selectedIds}
        onToggle={toggleProduct}
        onClear={clearFilter}
      />

      <div className="flex-1 min-w-0">
        {/* Search + category filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full min-h-[44px] rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label="Search products"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <button
              onClick={() => setCategoryFilter('')}
              className={[
                'px-3 py-1.5 rounded-full text-sm border transition-colors min-h-[44px]',
                categoryFilter === ''
                  ? 'bg-[var(--accent)] text-[var(--bg-primary)] border-[var(--accent)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]',
              ].join(' ')}
              style={{ touchAction: 'manipulation' }}
              aria-pressed={categoryFilter === ''}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat === categoryFilter ? '' : cat)}
                className={[
                  'px-3 py-1.5 rounded-full text-sm border transition-colors min-h-[44px]',
                  categoryFilter === cat
                    ? 'bg-[var(--accent)] text-[var(--bg-primary)] border-[var(--accent)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]',
                ].join(' ')}
                style={{ touchAction: 'manipulation' }}
                aria-pressed={categoryFilter === cat}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {selectedIds.length > 0 && (
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Showing {displayed.length} product{displayed.length !== 1 ? 's' : ''} compatible with your build.
          </p>
        )}

        {displayed.length === 0 ? (
          <p className="text-[var(--text-secondary)] text-center py-16">
            {selectedIds.length > 0
              ? 'No compatible products found for your selection.'
              : 'No products match your search.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayed.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
