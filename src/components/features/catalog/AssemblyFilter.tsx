'use client'

import { X } from 'lucide-react'
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

interface AssemblyFilterProps {
  products: Product[]
  selectedIds: string[]
  onToggle: (id: string) => void
  onClear: () => void
}

// Group products by category for the sidebar
function groupByCategory(products: Product[]) {
  const groups: Partial<Record<Product['category'], Product[]>> = {}
  for (const p of products) {
    if (!groups[p.category]) groups[p.category] = []
    groups[p.category]!.push(p)
  }
  return groups
}

export function AssemblyFilter({ products, selectedIds, onToggle, onClear }: AssemblyFilterProps) {
  const groups = groupByCategory(products)

  return (
    <aside className="w-full lg:w-64 shrink-0" aria-label="Assembly compatibility filter">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-[var(--text-primary)] text-sm">Build Filter</h2>
          {selectedIds.length > 0 && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] min-h-[44px] min-w-[44px] justify-end"
              style={{ touchAction: 'manipulation' }}
              aria-label="Clear all selected components"
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>

        <p className="text-xs text-[var(--text-secondary)] mb-4">
          Select components to see what&apos;s compatible with your build.
        </p>

        <div className="space-y-4">
          {(Object.entries(groups) as [Product['category'], Product[]][]).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                {CATEGORY_LABELS[category]}
              </p>
              <ul className="space-y-0.5" role="list">
                {items.map((product) => {
                  const checked = selectedIds.includes(product.id)
                  return (
                    <li key={product.id}>
                      <label
                        className={[
                          'flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer transition-colors text-sm min-h-[44px]',
                          'hover:bg-[var(--bg-primary)]',
                          checked ? 'bg-[var(--bg-primary)] font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]',
                        ].join(' ')}
                        style={{ touchAction: 'manipulation' }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggle(product.id)}
                          className="accent-[var(--accent)] shrink-0"
                          aria-label={`Add ${product.name} to build`}
                        />
                        <span className="leading-snug truncate">{product.name}</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {selectedIds.length > 0 && (
          <p className="mt-4 text-xs text-[var(--text-secondary)] border-t border-[var(--border)] pt-3">
            {selectedIds.length} component{selectedIds.length > 1 ? 's' : ''} in build
          </p>
        )}
      </div>
    </aside>
  )
}
