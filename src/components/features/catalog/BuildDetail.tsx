'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  Clock, DollarSign, Wrench, ChevronRight, Package,
  Zap, CheckCircle2, Circle, Box, ExternalLink,
  Gauge, Weight, Cpu, Wind, Battery, TrendingUp, Map, Activity,
} from 'lucide-react'
import { useLocale } from 'next-intl'
import { ROUTES, localePath } from '@/constants/routes'
import type { DroneBuild, Product } from '@/types'

const Product3DViewer = dynamic(
  () => import('./Product3DViewer').then((m) => ({ default: m.Product3DViewer })),
  { ssr: false, loading: () => <div className="w-full h-full bg-[var(--bg-secondary)] animate-pulse rounded-lg" /> }
)

const DIFFICULTY_COLORS: Record<DroneBuild['difficulty'], string> = {
  beginner:     '#22c55e',
  intermediate: '#f59e0b',
  advanced:     '#ef4444',
}

const DIFFICULTY_LABELS: Record<DroneBuild['difficulty'], string> = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
}

const CATEGORY_COLORS: Record<Product['category'], string> = {
  frame: '#6366f1', motor: '#f59e0b', esc: '#10b981',
  flight_controller: '#3b82f6', propeller: '#8b5cf6',
  battery: '#ef4444', camera: '#ec4899', complete_drone: '#0ea5e9',
}

const CATEGORY_LABELS: Record<Product['category'], string> = {
  frame: 'Frame', motor: 'Motor', esc: 'ESC',
  flight_controller: 'Flight Controller', propeller: 'Propeller',
  battery: 'Battery', camera: 'Camera', complete_drone: 'Complete Drone',
}

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

// ── Component thumbnail ────────────────────────────────────────────────────
function ProductThumb({ product }: { product: Product }) {
  const [err, setErr] = useState(false)
  return (
    <div className="relative w-12 h-12 shrink-0 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] overflow-hidden flex items-center justify-center">
      {product.thumbnailUrl && !err ? (
        <Image src={`${base}${product.thumbnailUrl}`} alt={product.name} fill sizes="48px"
          className="object-cover" onError={() => setErr(true)} />
      ) : (
        <Package size={18} className="text-[var(--text-secondary)]" aria-hidden="true" />
      )}
    </div>
  )
}

// ── Stats panel ────────────────────────────────────────────────────────────
type BuildStats = NonNullable<DroneBuild['stats']>

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  accent?: boolean
}

function StatCard({ icon, label, value, sub, accent }: StatCardProps) {
  return (
    <div className={[
      'flex flex-col gap-2 p-4 rounded-xl border transition-colors',
      accent
        ? 'border-[var(--accent)]/30 bg-[var(--accent)]/5'
        : 'border-[var(--border)] bg-[var(--bg-secondary)]',
    ].join(' ')}>
      <div className={[
        'w-8 h-8 rounded-lg flex items-center justify-center',
        accent
          ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
          : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]',
      ].join(' ')}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-extrabold text-[var(--text-primary)] leading-none">{value}</p>
        {sub && <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{sub}</p>}
      </div>
      <p className="text-xs font-medium text-[var(--text-secondary)]">{label}</p>
    </div>
  )
}

function BuildStatsPanel({ stats }: { stats: BuildStats }) {
  const cards: StatCardProps[] = []

  if (stats.topSpeedKmh !== undefined)
    cards.push({ icon: <Gauge size={16} />, label: 'Top Speed', value: `${stats.topSpeedKmh} km/h`, sub: `~${Math.round(stats.topSpeedKmh * 0.621)} mph`, accent: true })

  if (stats.totalWeightG !== undefined)
    cards.push({ icon: <Weight size={16} />, label: 'All-up Weight', value: `${stats.totalWeightG} g`, sub: `${(stats.totalWeightG / 1000).toFixed(2)} kg` })

  if (stats.thrustToWeightRatio !== undefined)
    cards.push({ icon: <TrendingUp size={16} />, label: 'Thrust-to-Weight', value: `${stats.thrustToWeightRatio}×`, sub: 'higher = more agile', accent: stats.thrustToWeightRatio >= 6 })

  if (stats.maxPayloadG !== undefined && stats.maxPayloadG > 0)
    cards.push({ icon: <Package size={16} />, label: 'Max Payload', value: `${stats.maxPayloadG} g`, sub: 'additional carry weight' })

  if (stats.batteryCell !== undefined)
    cards.push({ icon: <Battery size={16} />, label: 'Battery', value: `${stats.batteryCell}S`, sub: `${stats.batteryCell * 3.7}V nominal` })

  if (stats.propSizeInch !== undefined)
    cards.push({ icon: <Wind size={16} />, label: 'Prop Size', value: `${stats.propSizeInch}"`, sub: `${Math.round(stats.propSizeInch * 25.4)} mm diameter` })

  if (stats.motorCount !== undefined)
    cards.push({ icon: <Cpu size={16} />, label: 'Motors', value: `${stats.motorCount}`, sub: stats.motorCount === 4 ? 'quadcopter' : stats.motorCount === 6 ? 'hexacopter' : 'multirotor' })

  if (stats.maxRangeKm !== undefined)
    cards.push({ icon: <Map size={16} />, label: 'Max Range', value: `${stats.maxRangeKm} km`, sub: `~${Math.round(stats.maxRangeKm * 1000)} m` })

  if (stats.hoverThrustPct !== undefined)
    cards.push({ icon: <Activity size={16} />, label: 'Hover Throttle', value: `${stats.hoverThrustPct}%`, sub: 'lower = more efficient' })

  if (cards.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Gauge size={15} className="text-[var(--accent)]" aria-hidden="true" />
        <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wide">Performance Stats</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
interface BuildDetailProps {
  build: DroneBuild
  products: Product[]
}

export function BuildDetail({ build, products }: BuildDetailProps) {
  const locale = useLocale()
  const [activeStep, setActiveStep] = useState(0)
  const [activeTab, setActiveTab] = useState<'steps' | 'components' | 'wiring'>('steps')
  const [show3D, setShow3D] = useState(false)

  // Resolve products for this build
  const buildProducts = build.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[]

  // Products for the active step
  const stepProducts = build.steps[activeStep]?.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[]

  const currentStep = build.steps[activeStep]

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left: info */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: DIFFICULTY_COLORS[build.difficulty] }}
            >
              {DIFFICULTY_LABELS[build.difficulty]}
            </span>
            <span className="text-xs text-[var(--text-secondary)] px-2.5 py-1 rounded-full border border-[var(--border)]">
              {build.useCase}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">{build.name}</h1>
          <p className="text-[var(--text-secondary)] leading-relaxed max-w-2xl">{build.description}</p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Clock size={15} className="text-[var(--accent)]" aria-hidden="true" />
              <span><strong className="text-[var(--text-primary)]">{build.flightTime}</strong> flight time</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <DollarSign size={15} className="text-[var(--accent)]" aria-hidden="true" />
              <span><strong className="text-[var(--text-primary)]">~${build.estimatedCost}</strong> estimated cost</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Wrench size={15} className="text-[var(--accent)]" aria-hidden="true" />
              <span><strong className="text-[var(--text-primary)]">{build.steps.length}</strong> assembly steps</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Package size={15} className="text-[var(--accent)]" aria-hidden="true" />
              <span><strong className="text-[var(--text-primary)]">{buildProducts.length}</strong> components</span>
            </div>
          </div>
        </div>

        {/* Right: 3D model / image */}
        <div className="lg:w-80 xl:w-96 shrink-0">
          <div className="relative aspect-square rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
            {show3D && build.modelUrl ? (
              <Product3DViewer modelUrl={build.modelUrl} productName={build.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Wrench size={64} className="text-[var(--text-secondary)] opacity-20" aria-hidden="true" />
              </div>
            )}
            {build.modelUrl && (
              <button
                onClick={() => setShow3D((v) => !v)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-primary)]/80 backdrop-blur border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
              >
                <Box size={13} aria-hidden="true" />
                {show3D ? 'Hide 3D' : 'View 3D'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats panel ─────────────────────────────────────────────────── */}
      {build.stats && <BuildStatsPanel stats={build.stats} />}

      {/* ── Tab navigation ──────────────────────────────────────────────── */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        {(['steps', 'components', 'wiring'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              'px-4 py-2.5 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px',
              activeTab === tab
                ? 'border-[var(--accent)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
            ].join(' ')}
          >
            {tab === 'steps' ? `Steps (${build.steps.length})` :
             tab === 'components' ? `Components (${buildProducts.length})` :
             `Wiring (${build.wires.length})`}
          </button>
        ))}
      </div>

      {/* ── Steps tab ───────────────────────────────────────────────────── */}
      {activeTab === 'steps' && (
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Step list sidebar */}
          <aside className="lg:w-64 shrink-0">
            <ol className="space-y-1" role="list">
              {build.steps.map((step, i) => (
                <li key={step.order}>
                  <button
                    onClick={() => setActiveStep(i)}
                    className={[
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                      activeStep === i
                        ? 'bg-[var(--accent)]/10 border border-[var(--accent)]/30'
                        : 'hover:bg-[var(--bg-secondary)] border border-transparent',
                    ].join(' ')}
                  >
                    {i < activeStep ? (
                      <CheckCircle2 size={16} className="text-green-500 shrink-0" aria-hidden="true" />
                    ) : i === activeStep ? (
                      <div className="w-4 h-4 rounded-full bg-[var(--accent)] shrink-0 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-[var(--bg-primary)]">{i + 1}</span>
                      </div>
                    ) : (
                      <Circle size={16} className="text-[var(--text-secondary)] shrink-0" aria-hidden="true" />
                    )}
                    <span className={[
                      'text-xs font-medium truncate',
                      activeStep === i ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]',
                    ].join(' ')}>
                      {step.title}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </aside>

          {/* Step detail */}
          <div className="flex-1 min-w-0 space-y-5">
            {currentStep && (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide">
                      Step {currentStep.order} of {build.steps.length}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">{currentStep.title}</h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{currentStep.description}</p>
                </div>

                {/* Wiring note */}
                {currentStep.wiringNote && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <Zap size={15} className="text-yellow-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400 mb-0.5">Wiring note</p>
                      <p className="text-xs text-[var(--text-secondary)]">{currentStep.wiringNote}</p>
                    </div>
                  </div>
                )}

                {/* Components for this step */}
                {stepProducts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Components used in this step</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {stepProducts.map((p) => (
                        <Link
                          key={p.id}
                          href={localePath(locale, `${ROUTES.CATALOG}/${p.slug}`)}
                          className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]/50 transition-colors"
                        >
                          <ProductThumb product={p} />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{p.name}</p>
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: CATEGORY_COLORS[p.category] + '20', color: CATEGORY_COLORS[p.category] }}
                            >
                              {CATEGORY_LABELS[p.category]}
                            </span>
                          </div>
                          <ExternalLink size={12} className="text-[var(--text-secondary)] shrink-0" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <button
                    onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                    disabled={activeStep === 0}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {activeStep + 1} / {build.steps.length}
                  </span>
                  <button
                    onClick={() => setActiveStep((s) => Math.min(build.steps.length - 1, s + 1))}
                    disabled={activeStep === build.steps.length - 1}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Components tab ──────────────────────────────────────────────── */}
      {activeTab === 'components' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {buildProducts.map((p) => (
            <Link
              key={p.id}
              href={localePath(locale, `${ROUTES.CATALOG}/${p.slug}`)}
              className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]/50 transition-colors group"
            >
              <ProductThumb product={p} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                  {p.name}
                </p>
                <p className="text-xs text-[var(--text-secondary)] truncate">{p.brand}</p>
                <span
                  className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: CATEGORY_COLORS[p.category] + '20', color: CATEGORY_COLORS[p.category] }}
                >
                  {CATEGORY_LABELS[p.category]}
                </span>
              </div>
              <ChevronRight size={14} className="text-[var(--text-secondary)] shrink-0 group-hover:text-[var(--accent)] transition-colors" aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}

      {/* ── Wiring tab ──────────────────────────────────────────────────── */}
      {activeTab === 'wiring' && (
        <div className="space-y-3">
          <p className="text-sm text-[var(--text-secondary)]">
            All electrical connections for this build. Follow these in order during assembly.
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
                  <th className="px-4 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide">From</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide">Pad</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide">To</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide">Pad</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide">Label</th>
                </tr>
              </thead>
              <tbody>
                {build.wires.map((wire, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-[var(--bg-primary)]' : 'bg-[var(--bg-secondary)]'}>
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{wire.fromComponent}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: wire.color }} aria-hidden="true" />
                        <code className="text-xs font-mono text-[var(--text-primary)]">{wire.fromPad}</code>
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{wire.toComponent}</td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-[var(--text-primary)]">{wire.toPad}</code>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{wire.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
