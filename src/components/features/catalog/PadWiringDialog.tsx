'use client'

/**
 * PadWiringDialog — side-by-side pad connection UI.
 *
 * - All pads always visible
 * - Pads already used in OTHER wires are greyed out (still clickable to see info)
 * - Click a pad on the left → pending (yellow)
 * - Click a pad on the right → connection made, line drawn
 * - Click a connected pad → removes that connection
 * - Save → wire appears in 3D canvas
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Check, Zap, Trash2, Package, RotateCcw } from 'lucide-react'
import type { Product, Pad } from '@/types'
import type { PadConnection, WiringConnection } from '@/lib/wiring'

const PAD_TYPE_COLORS: Record<Pad['type'], string> = {
  power:  '#ef4444',
  signal: '#3b82f6',
  phase:  '#f59e0b',
  data:   '#10b981',
}

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

// ── Component thumbnail ────────────────────────────────────────────────────
function ProductThumb({ product }: { product: Product }) {
  const [err, setErr] = useState(false)
  return (
    <div className="relative w-8 h-8 shrink-0 rounded bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden flex items-center justify-center">
      {product.thumbnailUrl && !err ? (
        <Image src={`${base}${product.thumbnailUrl}`} alt={product.name} fill sizes="32px"
          className="object-cover" onError={() => setErr(true)} />
      ) : (
        <Package size={14} className="text-[var(--text-secondary)]" aria-hidden="true" />
      )}
    </div>
  )
}

// ── Pad row ────────────────────────────────────────────────────────────────
type PadRowState = 'idle' | 'pending' | 'connected' | 'used-elsewhere' | 'disabled'

function PadRow({
  pad,
  side,
  rowState,
  wireColor,
  connectedToLabel,
  onClick,
}: {
  pad: Pad
  side: 'left' | 'right'
  rowState: PadRowState
  wireColor?: string
  connectedToLabel?: string
  onClick: () => void
}) {
  const isRight = side === 'right'

  const dotColor =
    rowState === 'connected'      ? wireColor ?? pad.color :
    rowState === 'pending'        ? '#facc15' :
    rowState === 'used-elsewhere' ? '#6b7280' :
    pad.color

  const rowClass = [
    'flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border transition-all select-none',
    isRight ? 'flex-row-reverse' : '',
    rowState === 'pending'
      ? 'border-yellow-400/70 bg-yellow-400/10 cursor-pointer'
      : rowState === 'connected'
      ? 'border-green-500/40 bg-green-500/5 cursor-pointer'
      : rowState === 'used-elsewhere'
      ? 'border-[var(--border)] opacity-40 cursor-not-allowed'
      : rowState === 'disabled'
      ? 'border-[var(--border)] opacity-25 cursor-not-allowed'
      : 'border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--bg-secondary)] cursor-pointer',
  ].join(' ')

  return (
    <button
      onClick={rowState === 'used-elsewhere' || rowState === 'disabled' ? undefined : onClick}
      className={rowClass}
      title={
        rowState === 'used-elsewhere' ? `Already used in another wire` :
        rowState === 'connected' ? `Connected to ${connectedToLabel} — click to remove` :
        undefined
      }
    >
      {/* Connector dot */}
      <span
        className="shrink-0 w-3 h-3 rounded-full border-2 border-[var(--bg-primary)] shadow-sm flex-none"
        style={{ backgroundColor: dotColor }}
        aria-hidden="true"
      />
      {/* Label */}
      <span className={`flex-1 text-[11px] font-semibold truncate ${isRight ? 'text-right' : ''}`}
        style={{ color: rowState === 'connected' ? wireColor : 'var(--text-primary)' }}>
        {pad.label}
      </span>
      {/* Type badge */}
      <span
        className="shrink-0 text-[9px] font-bold px-1 py-0.5 rounded"
        style={{ backgroundColor: PAD_TYPE_COLORS[pad.type] + '20', color: PAD_TYPE_COLORS[pad.type] }}
      >
        {pad.type}
      </span>
      {/* Remove icon for connected pads */}
      {rowState === 'connected' && (
        <X size={10} className="shrink-0 text-red-400 opacity-70" aria-hidden="true" />
      )}
    </button>
  )
}

// ── SVG bezier lines ───────────────────────────────────────────────────────
function ConnectionLines({
  connections,
  leftPads,
  rightPads,
  pendingLeftPadId,
  containerRef,
}: {
  connections: Array<PadConnection & { color: string }>
  leftPads: Pad[]
  rightPads: Pad[]
  pendingLeftPadId: string | null
  containerRef: React.RefObject<HTMLDivElement>
}) {
  // Re-render this component on a rAF tick so DOM positions are stable
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let raf: number
    const bump = () => { setTick((n) => n + 1) }
    // One initial measurement after mount
    raf = requestAnimationFrame(bump)
    return () => cancelAnimationFrame(raf)
  }, [connections, pendingLeftPadId]) // re-measure when connections change

  const container = containerRef.current
  if (!container) return null

  const rect = container.getBoundingClientRect()
  const W = rect.width
  const H = rect.height
  if (W === 0) return null

  const getY = (padKey: string): number => {
    const el = container.querySelector(`[data-pad-id="${padKey}"]`)
    if (!el) return 0
    const elRect = el.getBoundingClientRect()
    return elRect.top - rect.top + elRect.height / 2
  }

  const midX = W / 2

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-10"
      width={W}
      height={H}
      aria-hidden="true"
    >
      {connections.map((conn, i) => {
        const y1 = getY(`left-${conn.padIdA}`)
        const y2 = getY(`right-${conn.padIdB}`)
        if (!y1 || !y2) return null
        return (
          <g key={i}>
            <path
              d={`M 0 ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${W} ${y2}`}
              fill="none"
              stroke={conn.color}
              strokeWidth="2"
              strokeOpacity="0.85"
            />
            <circle cx={midX} cy={(y1 + y2) / 2} r="3.5" fill={conn.color} opacity="0.9" />
          </g>
        )
      })}
      {pendingLeftPadId && (() => {
        const y = getY(`left-${pendingLeftPadId}`)
        if (!y) return null
        return (
          <line x1="0" y1={y} x2={midX} y2={y}
            stroke="#facc15" strokeWidth="2" strokeDasharray="5 3" strokeOpacity="0.8" />
        )
      })()}
    </svg>
  )
}

// ── Main dialog ────────────────────────────────────────────────────────────
export interface PadWiringDialogProps {
  productA: Product
  productB: Product
  connectionType: WiringConnection
  /** Existing connections for THIS wire (for edit mode) */
  existingConnections: PadConnection[]
  /** Pad IDs on productA already used in OTHER wires */
  usedPadsA: Set<string>
  /** Pad IDs on productB already used in OTHER wires */
  usedPadsB: Set<string>
  onConfirm: (connections: PadConnection[]) => void
  onClose: () => void
}

export function PadWiringDialog({
  productA,
  productB,
  connectionType,
  existingConnections,
  usedPadsA,
  usedPadsB,
  onConfirm,
  onClose,
}: PadWiringDialogProps) {
  const [connections, setConnections] = useState<PadConnection[]>(existingConnections)
  const [pendingLeftPadId, setPendingLeftPadId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync when existingConnections changes (edit mode re-open)
  useEffect(() => {
    setConnections(existingConnections)
    setPendingLeftPadId(null)
  }, [existingConnections])

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const leftPads  = productA.pads
  const rightPads = productB.pads

  // Determine state for each pad
  const getLeftState = useCallback((pad: Pad): PadRowState => {
    if (pad.id === pendingLeftPadId) return 'pending'
    if (connections.some((c) => c.padIdA === pad.id)) return 'connected'
    if (usedPadsA.has(pad.id)) return 'used-elsewhere'
    return 'idle'
  }, [connections, pendingLeftPadId, usedPadsA])

  const getRightState = useCallback((pad: Pad): PadRowState => {
    if (connections.some((c) => c.padIdB === pad.id)) return 'connected'
    if (usedPadsB.has(pad.id)) return 'used-elsewhere'
    // If a left pad is pending, only compatible types are enabled
    if (pendingLeftPadId) {
      const leftPad = leftPads.find((p) => p.id === pendingLeftPadId)
      if (leftPad && leftPad.type !== pad.type) return 'disabled'
    }
    return 'idle'
  }, [connections, usedPadsB, pendingLeftPadId, leftPads])

  const getWireColor = useCallback((padId: string, side: 'left' | 'right') => {
    const conn = connections.find((c) => side === 'left' ? c.padIdA === padId : c.padIdB === padId)
    if (!conn) return undefined
    return leftPads.find((p) => p.id === conn.padIdA)?.color
  }, [connections, leftPads])

  const getConnectedToLabel = useCallback((padId: string, side: 'left' | 'right') => {
    const conn = connections.find((c) => side === 'left' ? c.padIdA === padId : c.padIdB === padId)
    if (!conn) return undefined
    const otherPad = side === 'left'
      ? rightPads.find((p) => p.id === conn.padIdB)
      : leftPads.find((p) => p.id === conn.padIdA)
    return otherPad?.label
  }, [connections, leftPads, rightPads])

  const handleLeftPad = useCallback((padId: string) => {
    const state = getLeftState(leftPads.find((p) => p.id === padId)!)
    if (state === 'connected') {
      // Remove this connection
      setConnections((prev) => prev.filter((c) => c.padIdA !== padId))
      setPendingLeftPadId(null)
      return
    }
    setPendingLeftPadId((prev) => prev === padId ? null : padId)
  }, [getLeftState, leftPads])

  const handleRightPad = useCallback((padId: string) => {
    const state = getRightState(rightPads.find((p) => p.id === padId)!)
    if (state === 'connected') {
      // Remove this connection
      setConnections((prev) => prev.filter((c) => c.padIdB !== padId))
      return
    }
    if (!pendingLeftPadId) return
    // Make the connection — replace any existing for these pads
    setConnections((prev) => [
      ...prev.filter((c) => c.padIdA !== pendingLeftPadId && c.padIdB !== padId),
      { padIdA: pendingLeftPadId, padIdB: padId },
    ])
    setPendingLeftPadId(null)
  }, [getRightState, rightPads, pendingLeftPadId])

  const connectionLines = connections.map((c) => ({
    ...c,
    color: leftPads.find((p) => p.id === c.padIdA)?.color ?? '#6b7280',
  }))

  const hasChanges = JSON.stringify(connections) !== JSON.stringify(existingConnections)

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Wire ${productA.name} ↔ ${productB.name}`}
        className="relative w-full max-w-2xl mx-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)] rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2">
            <Zap size={14} style={{ color: connectionType.color }} aria-hidden="true" />
            <span className="text-sm font-bold text-[var(--text-primary)]">{connectionType.label}</span>
            <span className="text-xs text-[var(--text-secondary)]">— pad wiring</span>
          </div>
          <div className="flex items-center gap-1.5">
            {connections.length > 0 && (
              <button
                onClick={() => { setConnections([]); setPendingLeftPadId(null) }}
                className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)] hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
              >
                <Trash2 size={10} />Clear all
              </button>
            )}
            {hasChanges && (
              <button
                onClick={() => { setConnections(existingConnections); setPendingLeftPadId(null) }}
                className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-2 py-1 rounded hover:bg-[var(--bg-secondary)]"
              >
                <RotateCcw size={10} />Reset
              </button>
            )}
            <button onClick={onClose} aria-label="Close"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ── Instruction bar ──────────────────────────────────────────── */}
        <div className="px-4 py-2 text-[10px] text-[var(--text-secondary)] bg-[var(--bg-secondary)]/40 border-b border-[var(--border)] shrink-0">
          {pendingLeftPadId
            ? <>
                <span className="text-yellow-400 font-semibold">
                  {leftPads.find((p) => p.id === pendingLeftPadId)?.label}
                </span>
                {' '}selected — click a matching pad on the right to connect, or click same pad to cancel
              </>
            : 'Click a pad on the left to start · Click a connected pad to remove it · Greyed pads are used in other wires'
          }
        </div>

        {/* ── Component headers ────────────────────────────────────────── */}
        <div className="flex border-b border-[var(--border)] shrink-0">
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border-r border-[var(--border)]">
            <ProductThumb product={productA} />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-[var(--text-primary)] truncate">{productA.name}</p>
              <p className="text-[9px] text-[var(--text-secondary)]">{productA.brand}</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5">
            <ProductThumb product={productB} />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-[var(--text-primary)] truncate">{productB.name}</p>
              <p className="text-[9px] text-[var(--text-secondary)]">{productB.brand}</p>
            </div>
          </div>
        </div>

        {/* ── Pad columns with SVG overlay ─────────────────────────────── */}
        <div ref={containerRef} className="relative flex flex-1 overflow-y-auto min-h-0">
          {/* Left pads */}
          <div className="flex-1 border-r border-[var(--border)] p-2 space-y-1">
            {leftPads.length === 0 ? (
              <p className="text-[10px] text-[var(--text-secondary)] text-center py-6">No pads defined</p>
            ) : leftPads.map((pad) => {
              const state = getLeftState(pad)
              return (
                <div key={pad.id} data-pad-id={`left-${pad.id}`}>
                  <PadRow
                    pad={pad}
                    side="left"
                    rowState={state}
                    wireColor={getWireColor(pad.id, 'left')}
                    connectedToLabel={getConnectedToLabel(pad.id, 'left')}
                    onClick={() => handleLeftPad(pad.id)}
                  />
                </div>
              )
            })}
          </div>

          {/* SVG bezier lines */}
          <ConnectionLines
            connections={connectionLines}
            leftPads={leftPads}
            rightPads={rightPads}
            pendingLeftPadId={pendingLeftPadId}
            containerRef={containerRef}
          />

          {/* Right pads */}
          <div className="flex-1 p-2 space-y-1">
            {rightPads.length === 0 ? (
              <p className="text-[10px] text-[var(--text-secondary)] text-center py-6">No pads defined</p>
            ) : rightPads.map((pad) => {
              const state = getRightState(pad)
              return (
                <div key={pad.id} data-pad-id={`right-${pad.id}`}>
                  <PadRow
                    pad={pad}
                    side="right"
                    rowState={state}
                    wireColor={getWireColor(pad.id, 'right')}
                    connectedToLabel={getConnectedToLabel(pad.id, 'right')}
                    onClick={() => handleRightPad(pad.id)}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-secondary)] rounded-b-2xl shrink-0">
          <span className="text-[10px] text-[var(--text-secondary)]">
            {connections.length === 0
              ? 'No pad connections — wire will still appear in 3D'
              : `${connections.length} pad${connections.length !== 1 ? 's' : ''} connected`}
          </span>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
              Cancel
            </button>
            <button
              onClick={() => onConfirm(connections)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Check size={12} />
              Save wiring
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
