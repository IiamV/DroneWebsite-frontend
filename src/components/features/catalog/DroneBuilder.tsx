'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Search, Plus, Minus, X, Package, Box, Loader2, ChevronDown, ChevronUp, Zap, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import * as THREE from 'three'
import { Input } from '@/components/ui/input'
import { filterCompatibleProducts } from '@/lib/compatibility'
import { getWiringConnection, makeWireId } from '@/lib/wiring'
import type { Wire } from '@/lib/wiring'
import type { Product } from '@/types'
import type { PlacedProduct } from './AssemblyCanvas'
import { WiringPopup } from './WiringPopup'
import { PadWiringDialog } from './PadWiringDialog'

// Matches CATEGORY_SCALES in AssemblyCanvas — used to compute snap world positions
const CATEGORY_SCALES: Record<Product['category'], number> = {
  frame: 0.6, motor: 0.2, esc: 0.25, flight_controller: 0.2,
  propeller: 0.3, battery: 0.35, camera: 0.15, complete_drone: 0.6,
}

// ── Dynamic import (SSR-safe) ──────────────────────────────────────────────
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

// ── Helpers ────────────────────────────────────────────────────────────────
function makeInstanceId() {
  return `inst_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`
}

// ── Constants ──────────────────────────────────────────────────────────────
const CATEGORY_ORDER: Product['category'][] = [
  'frame', 'motor', 'esc', 'flight_controller',
  'propeller', 'battery', 'camera', 'complete_drone',
]

const CATEGORY_LABELS: Record<Product['category'], string> = {
  frame: 'Frame', motor: 'Motor', esc: 'ESC',
  flight_controller: 'Flight Controller', propeller: 'Propeller',
  battery: 'Battery', camera: 'Camera', complete_drone: 'Complete Drone',
}

const CATEGORY_COLORS: Record<Product['category'], string> = {
  frame: '#6366f1', motor: '#f59e0b', esc: '#10b981',
  flight_controller: '#3b82f6', propeller: '#8b5cf6',
  battery: '#ef4444', camera: '#ec4899', complete_drone: '#0ea5e9',
}

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

// ── Thumbnail ──────────────────────────────────────────────────────────────
function Thumb({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false)
  if (err) return <Package size={18} aria-hidden="true" className="text-[var(--text-secondary)]" />
  return <Image src={`${base}${src}`} alt={alt} fill sizes="40px" className="object-cover" onError={() => setErr(true)} />
}

// ── Component row ──────────────────────────────────────────────────────────
interface ComponentRowProps {
  product: Product
  instanceCount: number   // how many instances are on the canvas
  compatible: boolean
  onSpawn: (id: string) => void
  onDragStart: (e: React.DragEvent, id: string) => void
}

function ComponentRow({ product, instanceCount, compatible, onSpawn, onDragStart }: ComponentRowProps) {
  const hasModel = product.modelUrl !== null
  // Only hard-disable parts with no 3D model — incompatible parts are dimmed but still spawnable
  const disabled = !hasModel
  const dimmed = hasModel && !compatible

  return (
    <li
      draggable={hasModel}
      onDragStart={(e) => { if (!hasModel) { e.preventDefault(); return } onDragStart(e, product.id) }}
      className={[
        'flex items-center gap-2 px-2 py-2 rounded-lg border transition-colors',
        disabled
          ? 'border-[var(--border)] opacity-35 cursor-not-allowed'
          : dimmed
          ? 'border-[var(--border)] opacity-50 hover:opacity-80 hover:border-[var(--accent)]/40 cursor-grab active:cursor-grabbing'
          : 'border-[var(--border)] hover:border-[var(--accent)]/60 cursor-grab active:cursor-grabbing',
      ].join(' ')}
      title={!hasModel ? 'No 3D model available' : dimmed ? 'Not compatible with current build — can still be placed' : 'Drag to canvas or click + to spawn'}
    >
      {/* Thumbnail */}
      <div className="relative w-8 h-8 shrink-0 rounded bg-[var(--bg-primary)] overflow-hidden flex items-center justify-center">
        {product.thumbnailUrl
          ? <Thumb src={product.thumbnailUrl} alt={product.name} />
          : <Package size={14} aria-hidden="true" className="text-[var(--text-secondary)]" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-[var(--text-primary)] truncate leading-tight">{product.name}</p>
        <p className="text-[10px] text-[var(--text-secondary)] truncate">{product.brand}</p>
        {!hasModel && <p className="text-[9px] text-red-500 truncate mt-0.5">No 3D model</p>}
      </div>

      {/* 3D badge */}
      {hasModel ? (
        <span title="3D model available"
          className="shrink-0 flex items-center gap-0.5 text-[9px] font-bold px-1 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
          <Box size={8} aria-hidden="true" />3D
        </span>
      ) : (
        <span title="No 3D model"
          className="shrink-0 flex items-center gap-0.5 text-[9px] font-bold px-1 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
          <X size={8} aria-hidden="true" />
        </span>
      )}

      {/* Instance counter + spawn button */}
      <div className="shrink-0 flex items-center gap-1">
        {instanceCount > 0 && (
          <span className="text-[9px] font-bold w-4 text-center text-[var(--accent)]">
            {instanceCount}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); !disabled && onSpawn(product.id) }}
          aria-label={`Spawn ${product.name}`}
          disabled={disabled}
          className={[
            'w-6 h-6 rounded-full flex items-center justify-center border transition-colors',
            disabled
              ? 'opacity-30 cursor-not-allowed border-[var(--border)]'
              : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10',
          ].join(' ')}
        >
          <Plus size={11} />
        </button>
      </div>
    </li>
  )
}

// ── Category section ───────────────────────────────────────────────────────
interface CategorySectionProps {
  category: Product['category']
  products: Product[]
  instanceCounts: Record<string, number>
  compatibleIds: Set<string>
  hasAnySelected: boolean
  onSpawn: (id: string) => void
  onDragStart: (e: React.DragEvent, id: string) => void
}

function CategorySection({ category, products, instanceCounts, compatibleIds, hasAnySelected, onSpawn, onDragStart }: CategorySectionProps) {
  const [open, setOpen] = useState(true)
  const color = CATEGORY_COLORS[category]
  const label = CATEGORY_LABELS[category]
  const totalInstances = products.reduce((sum, p) => sum + (instanceCounts[p.id] ?? 0), 0)

  return (
    <div>
      <button onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-white/5 transition-colors text-left"
        aria-expanded={open}>
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
        <span className="flex-1 text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider">{label}</span>
        {totalInstances > 0 && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>
            {totalInstances}
          </span>
        )}
        {open ? <ChevronUp size={11} className="text-[var(--text-secondary)] shrink-0" />
               : <ChevronDown size={11} className="text-[var(--text-secondary)] shrink-0" />}
      </button>
      {open && (
        <ul className="space-y-1 mt-1 mb-2" role="list" aria-label={`${label} components`}>
          {products.map((p) => (
            <ComponentRow key={p.id} product={p}
              instanceCount={instanceCounts[p.id] ?? 0}
              compatible={!hasAnySelected || compatibleIds.has(p.id) || (instanceCounts[p.id] ?? 0) > 0}
              onSpawn={onSpawn}
              onDragStart={onDragStart} />
          ))}
        </ul>
      )}
    </div>
  )
}

// ── Placed part chip (bottom-left) ─────────────────────────────────────────
function PlacedChip({ pp, onDelete }: { pp: PlacedProduct; onDelete: (instanceId: string) => void }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border bg-[var(--bg-primary)]/60 text-[var(--text-primary)]"
      style={{ borderColor: CATEGORY_COLORS[pp.product.category] + '70' }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[pp.product.category] }} aria-hidden="true" />
      <span className="truncate max-w-[90px]">{pp.product.name}</span>
      <button onClick={() => onDelete(pp.instanceId)} aria-label={`Remove ${pp.product.name}`}
        className="ml-0.5 text-[var(--text-secondary)] hover:text-red-400 transition-colors">
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

  // ── State ─────────────────────────────────────────────────────────────
  const [placedProducts, setPlacedProducts] = useState<PlacedProduct[]>([])
  const [search, setSearch] = useState('')
  const [panelOpen, setPanelOpen] = useState(true)
  const [wires, setWires] = useState<Wire[]>([])
  const [pendingWireSourceId, setPendingWireSourceId] = useState<string | null>(null)
  const [wiringMode, setWiringMode] = useState(false)
  const [activePopup, setActivePopup] = useState<{ wire: Wire; screenX: number; screenY: number } | null>(null)

  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 1, h: 1 })

  // ── Derived: which product IDs are on the canvas and how many ─────────
  const instanceCounts = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {}
    for (const pp of placedProducts) {
      counts[pp.product.id] = (counts[pp.product.id] ?? 0) + 1
    }
    return counts
  }, [placedProducts])

  // Product IDs that have at least one instance placed
  const placedProductIds = useMemo(() => Object.keys(instanceCounts), [instanceCounts])

  // Compatible IDs based on what's placed
  const compatibleIds = useMemo<Set<string>>(() => {
    if (placedProductIds.length === 0) return new Set(products.map((p) => p.id))
    const compatible = filterCompatibleProducts(placedProductIds, products)
    return new Set(compatible.map((p) => p.id))
  }, [placedProductIds, products])

  // ── Spawn a new instance at a default offset position ─────────────────
  const spawnProduct = useCallback((productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product?.modelUrl) return
    const count = instanceCounts[productId] ?? 0
    // Offset each new instance slightly so they don't stack exactly
    const offset = count * 0.5
    const position: [number, number, number] = [offset, 0, offset]
    setPlacedProducts((prev) => [...prev, { instanceId: makeInstanceId(), product, position }])
  }, [products, instanceCounts])

  // ── Drop from panel onto canvas ───────────────────────────────────────
  const handleDrop = useCallback((productId: string, clientX: number, clientY: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product?.modelUrl) return
    const { w, h } = canvasSizeRef.current
    const nx = (clientX / w) * 2 - 1
    const ny = -(clientY / h) * 2 + 1
    const spread = 3
    const position: [number, number, number] = [nx * spread, 0, -ny * spread]
    setPlacedProducts((prev) => [...prev, { instanceId: makeInstanceId(), product, position }])
  }, [products])

  // ── Delete a placed instance ──────────────────────────────────────────
  const deleteInstance = useCallback((instanceId: string) => {
    setPlacedProducts((prev) => prev.filter((pp) => pp.instanceId !== instanceId))
    setWires((ws) => ws.filter((w) => w.productIdA !== instanceId && w.productIdB !== instanceId))
    if (pendingWireSourceId === instanceId) setPendingWireSourceId(null)
  }, [pendingWireSourceId])

  // ── Clear everything ──────────────────────────────────────────────────
  const clearAll = useCallback(() => {
    setPlacedProducts([])
    setWires([])
    setPendingWireSourceId(null)
    setWiringMode(false)
    setActivePopup(null)
  }, [])

  // ── Position update ───────────────────────────────────────────────────
  const handleUpdatePosition = useCallback((instanceId: string, newPos: [number, number, number]) => {
    setPlacedProducts((prev) =>
      prev.map((pp) => pp.instanceId === instanceId ? { ...pp, position: newPos } : pp)
    )
  }, [])

  // ── Wiring ────────────────────────────────────────────────────────────
  // Pending dialog state — set when two connectors are selected
  const [padWiringDialog, setPadWiringDialog] = useState<{
    sourceInstanceId: string
    targetInstanceId: string
  } | null>(null)

  const handleConnectorClick = useCallback((instanceId: string, _worldPos: THREE.Vector3) => {
    if (!pendingWireSourceId) {
      setPendingWireSourceId(instanceId)
      return
    }
    if (pendingWireSourceId === instanceId) {
      setPendingWireSourceId(null)
      return
    }

    const wireId = makeWireId(pendingWireSourceId, instanceId)
    // If wire already exists, open its popup instead
    const existing = wires.find((w) => w.id === wireId)
    if (existing) {
      setPendingWireSourceId(null)
      setActivePopup({ wire: existing, screenX: window.innerWidth / 2, screenY: window.innerHeight / 2 })
      return
    }

    // Open the pad wiring dialog
    setPadWiringDialog({ sourceInstanceId: pendingWireSourceId, targetInstanceId: instanceId })
    setPendingWireSourceId(null)
  }, [pendingWireSourceId, wires])

  // Called when user confirms pad connections in the dialog
  const handlePadWiringConfirm = useCallback((padConnections: import('@/lib/wiring').PadConnection[]) => {
    if (!padWiringDialog) return
    const { sourceInstanceId, targetInstanceId } = padWiringDialog
    const sourceInstance = placedProducts.find((pp) => pp.instanceId === sourceInstanceId)
    const targetInstance = placedProducts.find((pp) => pp.instanceId === targetInstanceId)
    if (!sourceInstance || !targetInstance) { setPadWiringDialog(null); return }

    const wireId = makeWireId(sourceInstanceId, targetInstanceId)
    const connectionType = getWiringConnection(sourceInstance.product.category, targetInstance.product.category)
    const newWire: Wire = {
      id: wireId,
      productIdA: sourceInstanceId,
      productIdB: targetInstanceId,
      connectionType,
      padConnections,
    }
    setWires((prev) => [...prev.filter((w) => w.id !== wireId), newWire])
    setPadWiringDialog(null)
  }, [padWiringDialog, placedProducts])

  const handleWireClick = useCallback((wireId: string, _screenX: number, _screenY: number) => {
    const wire = wires.find((w) => w.id === wireId)
    if (!wire) return
    // Open the pad wiring dialog in edit mode
    setPadWiringDialog({ sourceInstanceId: wire.productIdA, targetInstanceId: wire.productIdB })
  }, [wires])

  const handleDeleteWire = useCallback((wireId: string) => {
    setWires((prev) => prev.filter((w) => w.id !== wireId))
  }, [])

  const handleCanvasClick = useCallback(() => {
    if (pendingWireSourceId) setPendingWireSourceId(null)
  }, [pendingWireSourceId])

  // ── Drag start from panel ─────────────────────────────────────────────
  const handleDragStart = useCallback((e: React.DragEvent, productId: string) => {
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('productId', productId)
  }, [])

  // ── Filtered + grouped products ───────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))
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

  // ── Popup instance lookup ─────────────────────────────────────────────
  const getInstanceProduct = (instanceId: string) =>
    placedProducts.find((pp) => pp.instanceId === instanceId)?.product

  const popupProductA = activePopup ? getInstanceProduct(activePopup.wire.productIdA) : null
  const popupProductB = activePopup ? getInstanceProduct(activePopup.wire.productIdB) : null

  return (
    <div className="fixed inset-0 top-16 z-30 w-full" onClick={handleCanvasClick}>

      {/* ── Canvas ────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[var(--bg-secondary)]"
        ref={(el) => {
          if (el) {
            const ro = new ResizeObserver(([entry]) => {
              canvasSizeRef.current = { w: entry.contentRect.width, h: entry.contentRect.height }
            })
            ro.observe(el)
          }
        }}>
        <AssemblyCanvas
          placedProducts={placedProducts}
          wires={wires}
          pendingWireSourceId={pendingWireSourceId}
          wiringMode={wiringMode}
          onUpdatePosition={handleUpdatePosition}
          onDrop={handleDrop}
          onConnectorClick={handleConnectorClick}
          onWireClick={handleWireClick}
          onDeleteInstance={deleteInstance}
        />
      </div>

      {/* ── Hint bar ──────────────────────────────────────────────────── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-[var(--text-secondary)] bg-[var(--bg-primary)]/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[var(--border)] pointer-events-none select-none">
        {wiringMode
          ? pendingWireSourceId
            ? "Click another component's ● to connect · same ● to cancel"
            : "Click a component's ● to start a wire"
          : placedProducts.length > 0
          ? 'Click to select · Delete to remove · Drag axes to move · Toggle ⚡ to wire'
          : 'Click + or drag a component onto the canvas to start building'}
      </div>

      {/* ── Wire mode toggle + wire count (bottom-left) ───────────────── */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => {
            setWiringMode((v) => !v)
            if (wiringMode) setPendingWireSourceId(null)
          }}
          aria-label={wiringMode ? 'Exit wire mode' : 'Enter wire mode'}
          aria-pressed={wiringMode}
          className={[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all',
            wiringMode
              ? 'bg-yellow-500/20 border-yellow-500/60 text-yellow-400'
              : 'bg-[var(--bg-primary)]/70 backdrop-blur-sm border-[var(--border)] text-[var(--text-secondary)] hover:text-yellow-400 hover:border-yellow-500/40',
          ].join(' ')}
        >
          <Zap size={11} aria-hidden="true" />
          {wiringMode ? 'Wiring on' : 'Wire mode'}
        </button>
        {wires.length > 0 && (
          <span className="text-[10px] text-[var(--text-secondary)] bg-[var(--bg-primary)]/70 backdrop-blur-sm px-2 py-1.5 rounded-full border border-[var(--border)] select-none">
            {wires.length} {wires.length === 1 ? 'wire' : 'wires'}
          </span>
        )}
      </div>

      {/* ── Placed chips ──────────────────────────────────────────────── */}
      {placedProducts.length > 0 && (
        <div className="absolute bottom-12 left-4 flex flex-wrap gap-1.5 max-w-xs pointer-events-auto"
          onClick={(e) => e.stopPropagation()}>
          {placedProducts.map((pp) => (
            <PlacedChip key={pp.instanceId} pp={pp} onDelete={deleteInstance} />
          ))}
        </div>
      )}

      {/* ── Pad wiring dialog — full-screen overlay ───────────────────── */}
      {padWiringDialog && (() => {
        const srcInstance = placedProducts.find((pp) => pp.instanceId === padWiringDialog.sourceInstanceId)
        const tgtInstance = placedProducts.find((pp) => pp.instanceId === padWiringDialog.targetInstanceId)
        if (!srcInstance || !tgtInstance) return null
        const connectionType = getWiringConnection(srcInstance.product.category, tgtInstance.product.category)
        const existingWire = wires.find((w) => w.id === makeWireId(padWiringDialog.sourceInstanceId, padWiringDialog.targetInstanceId))

        // Collect pads already used in OTHER wires for each instance
        const wireId = makeWireId(padWiringDialog.sourceInstanceId, padWiringDialog.targetInstanceId)
        const usedPadsA = new Set(
          wires
            .filter((w) => w.id !== wireId && (w.productIdA === padWiringDialog.sourceInstanceId || w.productIdB === padWiringDialog.sourceInstanceId))
            .flatMap((w) => w.padConnections.map((c) =>
              w.productIdA === padWiringDialog.sourceInstanceId ? c.padIdA : c.padIdB
            ))
        )
        const usedPadsB = new Set(
          wires
            .filter((w) => w.id !== wireId && (w.productIdA === padWiringDialog.targetInstanceId || w.productIdB === padWiringDialog.targetInstanceId))
            .flatMap((w) => w.padConnections.map((c) =>
              w.productIdA === padWiringDialog.targetInstanceId ? c.padIdA : c.padIdB
            ))
        )

        return (
          <PadWiringDialog
            productA={srcInstance.product}
            productB={tgtInstance.product}
            connectionType={connectionType}
            existingConnections={existingWire?.padConnections ?? []}
            usedPadsA={usedPadsA}
            usedPadsB={usedPadsB}
            onConfirm={handlePadWiringConfirm}
            onClose={() => setPadWiringDialog(null)}
          />
        )
      })()}

      {/* ── Wiring popup ──────────────────────────────────────────────── */}
      {activePopup && popupProductA && popupProductB && (
        <div onClick={(e) => e.stopPropagation()}>
          <WiringPopup
            wire={activePopup.wire}
            productA={popupProductA}
            productB={popupProductB}
            anchorX={activePopup.screenX}
            anchorY={activePopup.screenY}
            onClose={() => setActivePopup(null)}
            onDelete={handleDeleteWire}
          />
        </div>
      )}

      {/* ── Floating component panel ───────────────────────────────────── */}
      <div className="absolute top-4 right-4 w-72 flex flex-col max-h-[calc(100vh-96px)] pointer-events-auto"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-t-xl border border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
          <span className="flex-1 text-xs font-bold text-[var(--text-primary)]">{t('builderComponents')}</span>
          {placedProducts.length > 0 && (
            <button onClick={clearAll}
              className="text-[10px] text-[var(--text-secondary)] hover:text-red-400 transition-colors flex items-center gap-1">
              <Trash2 size={9} />
              {t('clearAll')}
            </button>
          )}
          <button onClick={() => setPanelOpen((v) => !v)}
            aria-label={panelOpen ? 'Collapse panel' : 'Expand panel'}
            className="w-5 h-5 flex items-center justify-center rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            {panelOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {panelOpen && (
          <>
            {/* Search */}
            <div className="px-3 py-2 border-x border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
                <Input type="search" placeholder={t('searchComponents')} value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-7 h-7 text-[11px] bg-[var(--bg-secondary)]/80"
                  aria-label="Search components" />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 border-x border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md space-y-0.5">
              {grouped.size === 0 ? (
                <p className="text-[11px] text-[var(--text-secondary)] text-center py-6">No components match.</p>
              ) : (
                Array.from(grouped.entries()).map(([cat, items]) => (
                  <CategorySection key={cat} category={cat} products={items}
                    instanceCounts={instanceCounts}
                    compatibleIds={compatibleIds}
                    hasAnySelected={placedProductIds.length > 0}
                    onSpawn={spawnProduct}
                    onDragStart={handleDragStart} />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 rounded-b-xl border border-t-0 border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md space-y-1.5">
              <div className="text-[10px] text-[var(--text-secondary)]">
                {placedProducts.length === 0
                  ? t('noneSelected')
                  : `${placedProducts.length} ${placedProducts.length === 1 ? t('modelLoaded') : t('modelsLoaded')} on canvas`}
                {wires.length > 0 && (
                  <span className="ml-1 text-yellow-500">· {wires.length} {wires.length === 1 ? 'wire' : 'wires'}</span>
                )}
              </div>
              <div className="flex items-center gap-3 pt-1 border-t border-[var(--border)]">
                <span className="flex items-center gap-1 text-[9px] text-[var(--text-secondary)]">
                  <span className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 font-bold">
                    <Box size={7} />3D
                  </span>
                  Has 3D model
                </span>
                <span className="flex items-center gap-1 text-[9px] text-[var(--text-secondary)]">
                  <span className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-bold">
                    <Zap size={7} />
                  </span>
                  Toggle ⚡ to wire
                </span>
              </div>
            </div>
          </>
        )}

        {!panelOpen && placedProducts.length > 0 && (
          <div className="px-3 py-1.5 rounded-b-xl border border-t-0 border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md text-[10px] text-[var(--text-secondary)]">
            {placedProducts.length} on canvas
          </div>
        )}
      </div>
    </div>
  )
}
