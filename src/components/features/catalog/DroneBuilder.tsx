'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Search, Plus, Check, X, Package, Box, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { filterCompatibleProducts } from '@/lib/compatibility'
import type { Product } from '@/types'
import type { PlacedProduct } from './AssemblyCanvas'

// Must be ssr:false — Three.js/WebGL cannot run on the server
const AssemblyCanvas = dynamic(
  () => import('./AssemblyCanvas').then((m) => ({ default: m.AssemblyCanvas })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
        <Loader2 size={28} className="animate-spin" aria-label="Loading 3D viewer" />
      </div>
    ),
  }
)

// ── Constants ──────────────────────────────────────────────────────────────

const CATEGORY_ORDER: Product['category'][] = [
  'frame', 'motor', 'esc', 'flight_controller',
  'propeller', 'battery', 'camera', 'complete_drone',
]

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

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

// ── Thumbnail ──────────────────────────────────────────────────────────────

function Thumb({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false)
  if (err) return <Package size={18} aria-hidden="true" className="text-[var(--text-secondary)]" />
  return (
    <Image
      src={`${base}${src}`}
      alt={alt}
      fill
      sizes="40px"
      className="object-cover"
      onError={() => setErr(true)}
    />
  )
}

// ── Component row ──────────────────────────────────────────────────────────

interface ComponentRowProps {
  product: Product
  selected: boolean
  compatible: boolean
  onToggle: (id: string) => void
}

function ComponentRow({ product, selected, compatible, onToggle }: ComponentRowProps) {
  const hasModel = product.modelUrl !== null
  const disabled = !selected && (!compatible || !hasModel)

  const handleDragStart = (e: React.DragEvent) => {
    if (!hasModel) {
      e.preventDefault()
      return
    }
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('productId', product.id)
  }

  return (
    <li
      draggable={hasModel && !disabled}
      onDragStart={handleDragStart}
      className={[
        'flex items-center gap-2 px-2 py-2 rounded-lg border transition-colors',
        disabled
          ? 'border-[var(--border)] opacity-35 cursor-not-allowed'
          : selected
          ? 'border-[var(--accent)] bg-[var(--accent)]/10 cursor-pointer'
          : hasModel
          ? 'border-[var(--border)] hover:border-[var(--accent)]/60 cursor-grab active:cursor-grabbing'
          : 'border-[var(--border)] hover:border-[var(--accent)]/60 cursor-pointer',
      ].join(' ')}
      onClick={() => !disabled && onToggle(product.id)}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled}
      title={!hasModel ? 'No 3D model available' : 'Drag to canvas or click to add'}
    >
      {/* Thumbnail */}
      <div className="relative w-8 h-8 shrink-0 rounded bg-[var(--bg-primary)] overflow-hidden flex items-center justify-center">
        {product.thumbnailUrl
          ? <Thumb src={product.thumbnailUrl} alt={product.name} />
          : <Package size={14} aria-hidden="true" className="text-[var(--text-secondary)]" />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-[var(--text-primary)] truncate leading-tight">{product.name}</p>
        <p className="text-[10px] text-[var(--text-secondary)] truncate">{product.brand}</p>
        {!hasModel && (
          <p className="text-[9px] text-red-500 truncate mt-0.5">No 3D model</p>
        )}
      </div>

      {/* 3D badge */}
      {hasModel ? (
        <span
          title="3D model available"
          className="shrink-0 flex items-center gap-0.5 text-[9px] font-bold px-1 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
        >
          <Box size={8} aria-hidden="true" />
          3D
        </span>
      ) : (
        <span
          title="No 3D model available"
          className="shrink-0 flex items-center gap-0.5 text-[9px] font-bold px-1 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20"
        >
          <X size={8} aria-hidden="true" />
        </span>
      )}

      {/* Toggle */}
      <button
        onClick={(e) => { e.stopPropagation(); !disabled && onToggle(product.id) }}
        aria-label={selected ? `Remove ${product.name}` : `Add ${product.name}`}
        aria-pressed={selected}
        tabIndex={disabled ? -1 : 0}
        disabled={disabled}
        className={[
          'shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-colors',
          disabled
            ? 'opacity-30 cursor-not-allowed'
            : selected
            ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--bg-primary)]'
            : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
        ].join(' ')}
      >
        {selected ? <Check size={11} /> : <Plus size={11} />}
      </button>
    </li>
  )
}

// ── Category section ───────────────────────────────────────────────────────

interface CategorySectionProps {
  category: Product['category']
  products: Product[]
  selectedIds: string[]
  compatibleIds: Set<string>
  onToggle: (id: string) => void
}

function CategorySection({ category, products, selectedIds, compatibleIds, onToggle }: CategorySectionProps) {
  const [open, setOpen] = useState(true)
  const color = CATEGORY_COLORS[category]
  const label = CATEGORY_LABELS[category]
  const selectedCount = products.filter((p) => selectedIds.includes(p.id)).length

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-white/5 transition-colors text-left"
        aria-expanded={open}
      >
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
        <span className="flex-1 text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider">{label}</span>
        {selectedCount > 0 && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>
            {selectedCount}
          </span>
        )}
        {open
          ? <ChevronUp size={11} className="text-[var(--text-secondary)] shrink-0" />
          : <ChevronDown size={11} className="text-[var(--text-secondary)] shrink-0" />
        }
      </button>

      {open && (
        <ul className="space-y-1 mt-1 mb-2" role="listbox" aria-label={`${label} components`}>
          {products.map((p) => (
            <ComponentRow
              key={p.id}
              product={p}
              selected={selectedIds.includes(p.id)}
              compatible={compatibleIds.has(p.id) || selectedIds.length === 0}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

// ── Build chip ─────────────────────────────────────────────────────────────

function BuildChip({ product, onRemove }: { product: Product; onRemove: (id: string) => void }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border bg-[var(--bg-primary)]/60 text-[var(--text-primary)]"
      style={{ borderColor: CATEGORY_COLORS[product.category] + '70' }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[product.category] }} aria-hidden="true" />
      <span className="truncate max-w-[100px]">{product.name}</span>
      <button
        onClick={() => onRemove(product.id)}
        aria-label={`Remove ${product.name}`}
        className="ml-0.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <X size={9} />
      </button>
    </span>
  )
}

// ── Main DroneBuilder ──────────────────────────────────────────────────────

interface DroneBuilderProps {
  products: Product[]
}

export function DroneBuilder({ products }: DroneBuilderProps) {
  const t = useTranslations('catalog')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [placedProducts, setPlacedProducts] = useState<PlacedProduct[]>([])
  const [search, setSearch] = useState('')
  const [panelOpen, setPanelOpen] = useState(true)

  // Camera ref for converting screen coords to world coords on drop
  const cameraRef = useRef<THREE.Camera | null>(null)
  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 1, h: 1 })

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      // If removing, also remove from placed
      if (prev.includes(id)) {
        setPlacedProducts((pp) => pp.filter((p) => p.product.id !== id))
      }
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setSelectedIds([])
    setPlacedProducts([])
  }, [])

  // Called when a product is dropped onto the canvas from the list
  const handleDrop = useCallback((productId: string, clientX: number, clientY: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product || !product.modelUrl) return

    // Add to selected if not already
    setSelectedIds((prev) => prev.includes(productId) ? prev : [...prev, productId])

    // Convert 2D drop position to 3D world position on y=0 plane
    // Use a simple mapping: center of canvas = (0,0,0), edges = ±spread
    const { w, h } = canvasSizeRef.current
    const nx = (clientX / w) * 2 - 1   // -1 to +1
    const ny = -(clientY / h) * 2 + 1  // -1 to +1
    const spread = 3
    const worldX = nx * spread
    const worldZ = -ny * spread

    setPlacedProducts((prev) => {
      // If already placed, just update position
      if (prev.find((p) => p.product.id === productId)) {
        return prev.map((p) =>
          p.product.id === productId
            ? { ...p, position: [worldX, 0, worldZ] as [number, number, number] }
            : p
        )
      }
      return [...prev, { product, position: [worldX, 0, worldZ] as [number, number, number] }]
    })
  }, [products])

  // Called when a model is dragged to a new position inside the canvas
  const handleUpdatePosition = useCallback((productId: string, newPos: [number, number, number]) => {
    setPlacedProducts((prev) =>
      prev.map((p) => p.product.id === productId ? { ...p, position: newPos } : p)
    )
  }, [])

  const compatibleIds = useMemo<Set<string>>(() => {
    if (selectedIds.length === 0) return new Set(products.map((p) => p.id))
    const compatible = filterCompatibleProducts(selectedIds, products)
    return new Set(compatible.map((p) => p.id))
  }, [selectedIds, products])

  const filtered = useMemo(() => {
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [products, search])

  const grouped = useMemo(() => {
    const map = new Map<Product['category'], Product[]>()
    for (const cat of CATEGORY_ORDER) {
      const items = filtered.filter((p) => p.category === cat)
      if (items.length > 0) map.set(cat, items)
    }
    return map
  }, [filtered])

  const selectedProducts = useMemo(
    () => products.filter((p) => selectedIds.includes(p.id)),
    [products, selectedIds]
  )

  const renderableCount = placedProducts.length

  return (
    // Fixed full-viewport canvas — sits below the sticky nav (z-40, h-16)
    // position:fixed escapes the flex-col layout so the footer never shows
    <div className="fixed inset-0 top-16 z-30 w-full">

      {/* ── 3D canvas fills the entire area ─────────────────────────── */}
      <div
        className="absolute inset-0 bg-[var(--bg-secondary)]"
        ref={(el) => {
          if (el) {
            const ro = new ResizeObserver(([entry]) => {
              canvasSizeRef.current = { w: entry.contentRect.width, h: entry.contentRect.height }
            })
            ro.observe(el)
          }
        }}
      >
        <AssemblyCanvas
          placedProducts={placedProducts}
          onUpdatePosition={handleUpdatePosition}
          onDrop={handleDrop}
        />
      </div>

      {/* ── Hint ─────────────────────────────────────────────────────── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-[var(--text-secondary)] bg-[var(--bg-primary)]/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[var(--border)] pointer-events-none select-none">
        {renderableCount > 0
          ? 'Drag models to reposition · Scroll to zoom · Right-click to pan'
          : 'Drag a component from the panel onto the canvas'}
      </div>

      {/* ── Build chips (bottom-left) ─────────────────────────────────── */}
      {selectedProducts.length > 0 && (
        <div className="absolute bottom-12 left-4 flex flex-wrap gap-1.5 max-w-xs pointer-events-auto">
          {selectedProducts.map((p) => (
            <BuildChip key={p.id} product={p} onRemove={toggle} />
          ))}
        </div>
      )}

      {/* ── Floating component panel (top-right) ─────────────────────── */}
      <div className="absolute top-4 right-4 w-72 flex flex-col max-h-[calc(100vh-96px)] pointer-events-auto">

        {/* Panel header — always visible */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-t-xl border border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
          <span className="flex-1 text-xs font-bold text-[var(--text-primary)]">{t('builderComponents')}</span>
          {selectedIds.length > 0 && (
            <button
              onClick={clearAll}
              className="text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {t('clearAll')}
            </button>
          )}
          <button
            onClick={() => setPanelOpen((v) => !v)}
            aria-label={panelOpen ? 'Collapse panel' : 'Expand panel'}
            className="w-5 h-5 flex items-center justify-center rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {panelOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {panelOpen && (
          <>
            {/* Search */}
            <div className="px-3 py-2 border-x border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
                <Input
                  type="search"
                  placeholder={t('searchComponents')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-7 h-7 text-[11px] bg-[var(--bg-secondary)]/80"
                  aria-label="Search components"
                />
              </div>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto px-3 py-2 border-x border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md space-y-0.5">
              {grouped.size === 0 ? (
                <p className="text-[11px] text-[var(--text-secondary)] text-center py-6">No components match.</p>
              ) : (
                Array.from(grouped.entries()).map(([cat, items]) => (
                  <CategorySection
                    key={cat}
                    category={cat}
                    products={items}
                    selectedIds={selectedIds}
                    compatibleIds={compatibleIds}
                    onToggle={toggle}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 rounded-b-xl border border-t-0 border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md space-y-1.5">
              <div className="text-[10px] text-[var(--text-secondary)]">
                {selectedIds.length === 0
                  ? t('noneSelected')
                  : `${selectedIds.length} ${selectedIds.length === 1 ? t('componentSelected') : t('componentsSelected')} · ${t('compatibleShowing')}`
                }
                {renderableCount > 0 && (
                  <span className="ml-1 text-[var(--accent)]">
                    · {renderableCount} {renderableCount === 1 ? t('modelLoaded') : t('modelsLoaded')}
                  </span>
                )}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-3 pt-1 border-t border-[var(--border)]">
                <span className="flex items-center gap-1 text-[9px] text-[var(--text-secondary)]">
                  <span className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 font-bold">
                    <Box size={7} />3D
                  </span>
                  Has 3D model
                </span>
                <span className="flex items-center gap-1 text-[9px] text-[var(--text-secondary)]">
                  <span className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 font-bold">
                    <X size={7} />
                  </span>
                  No model, unavailable
                </span>
              </div>
            </div>
          </>
        )}

        {/* Collapsed state — show count badge */}
        {!panelOpen && selectedIds.length > 0 && (
          <div className="px-3 py-1.5 rounded-b-xl border border-t-0 border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md text-[10px] text-[var(--text-secondary)]">
            {selectedIds.length} selected
          </div>
        )}
      </div>
    </div>
  )
}
