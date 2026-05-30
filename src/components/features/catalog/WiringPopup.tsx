'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { X, Zap, AlertTriangle, Package } from 'lucide-react'
import type { Product } from '@/types'
import type { Wire } from '@/lib/wiring'

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

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

// ── Single component card ──────────────────────────────────────────────────
function ComponentCard({ product }: { product: Product }) {
  const [imgErr, setImgErr] = useState(false)

  return (
    <div className="flex-1 min-w-0 flex flex-col items-center gap-1.5 text-center">
      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center shrink-0">
        {product.thumbnailUrl && !imgErr ? (
          <Image
            src={`${base}${product.thumbnailUrl}`}
            alt={product.name}
            fill
            sizes="56px"
            className="object-cover"
            onError={() => setImgErr(true)}
          />
        ) : (
          <Package size={20} className="text-[var(--text-secondary)]" aria-hidden="true" />
        )}
      </div>
      <div>
        <p className="text-[10px] font-semibold text-[var(--text-primary)] leading-tight line-clamp-2">
          {product.name}
        </p>
        <p className="text-[9px] text-[var(--text-secondary)] mt-0.5">
          {CATEGORY_LABELS[product.category]}
        </p>
      </div>
    </div>
  )
}

// ── Wiring popup ───────────────────────────────────────────────────────────
interface WiringPopupProps {
  wire: Wire
  productA: Product
  productB: Product
  /** Screen position to anchor the popup near */
  anchorX: number
  anchorY: number
  onClose: () => void
  onDelete: (wireId: string) => void
}

export function WiringPopup({
  wire,
  productA,
  productB,
  anchorX,
  anchorY,
  onClose,
  onDelete,
}: WiringPopupProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { connectionType } = wire
  const isValid = connectionType.valid

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Close on outside click (delayed so the triggering click doesn't close it)
  useEffect(() => {
    let id: ReturnType<typeof setTimeout>
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    id = setTimeout(() => document.addEventListener('mousedown', handler), 150)
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler) }
  }, [onClose])

  // Clamp popup to viewport
  const POPUP_W = 320
  const POPUP_H = 260
  const left = Math.min(Math.max(anchorX - POPUP_W / 2, 8), window.innerWidth - POPUP_W - 8)
  const top  = Math.min(Math.max(anchorY - POPUP_H / 2, 8), window.innerHeight - POPUP_H - 8)

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={`Wire: ${productA.name} ↔ ${productB.name}`}
      className="fixed z-[100] rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-md shadow-2xl p-4 space-y-4"
      style={{ width: POPUP_W, left, top }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={13} style={{ color: connectionType.color }} aria-hidden="true" />
          <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wide">
            {connectionType.label}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close wiring popup"
          className="w-6 h-6 flex items-center justify-center rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      {/* Two components with connector line between them */}
      <div className="flex items-center gap-2">
        <ComponentCard product={productA} />

        {/* Wire visual */}
        <div className="flex flex-col items-center gap-0.5 shrink-0 px-1" aria-hidden="true">
          <div className="w-6 h-px" style={{ backgroundColor: connectionType.color }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: connectionType.color }} />
          <div className="w-6 h-px" style={{ backgroundColor: connectionType.color }} />
        </div>

        <ComponentCard product={productB} />
      </div>

      {/* Description */}
      <div
        className={[
          'rounded-lg p-3 text-xs leading-relaxed',
          isValid
            ? 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
            : 'bg-red-500/10 text-red-500 border border-red-500/20',
        ].join(' ')}
      >
        {!isValid && (
          <div className="flex items-center gap-1.5 mb-1.5 font-semibold">
            <AlertTriangle size={11} aria-hidden="true" />
            Incompatible connection
          </div>
        )}
        {connectionType.description}
      </div>

      {/* Delete action */}
      <div className="flex justify-end pt-1 border-t border-[var(--border)]">
        <button
          onClick={() => { onDelete(wire.id); onClose() }}
          className="text-xs text-red-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          Remove wire
        </button>
      </div>
    </div>
  )
}
