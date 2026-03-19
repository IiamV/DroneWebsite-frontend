'use client'

import { X, Package } from 'lucide-react'
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
  selectedProducts: Product[]
  onRemove: (id: string) => void
  onClear: () => void
}

export function AssemblyFilter({ selectedProducts, onRemove, onClear }: AssemblyFilterProps) {
  return (
    <aside className="w-full lg:w-56 shrink-0" aria-label="Build compatibility filter">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4 sticky top-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[var(--text-primary)] text-sm">My Build</h2>
          {selectedProducts.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Clear build"
            >
              Clear all
            </button>
          )}
        </div>

        {selectedProducts.length === 0 ? (
          <div className="text-center py-6">
            <Package size={28} className="mx-auto mb-2 text-[var(--text-secondary)] opacity-40" aria-hidden="true" />
            <p className="text-xs text-[var(--text-secondary)]">
              Add products to filter by compatibility.
            </p>
          </div>
        ) : (
          <ul className="space-y-2" role="list">
            {selectedProducts.map((p) => (
              <li key={p.id} className="flex items-center gap-2 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[var(--text-primary)] text-xs font-medium">{p.name}</p>
                  <p className="text-[var(--text-secondary)] text-xs">{CATEGORY_LABELS[p.category]}</p>
                </div>
                <button
                  onClick={() => onRemove(p.id)}
                  aria-label={`Remove ${p.name} from build`}
                  className="shrink-0 p-1 rounded hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {selectedProducts.length > 0 && (
          <p className="mt-3 pt-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
            {selectedProducts.length} component{selectedProducts.length !== 1 ? 's' : ''} — showing compatible products
          </p>
        )}
      </div>
    </aside>
  )
}
