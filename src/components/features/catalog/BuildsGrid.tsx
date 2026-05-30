'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { BuildCard } from './BuildCard'
import type { DroneBuild } from '@/types'

const DIFFICULTY_OPTIONS: { value: DroneBuild['difficulty'] | 'all'; label: string; color: string }[] = [
  { value: 'all',          label: 'All levels',    color: '#6b7280' },
  { value: 'beginner',     label: 'Beginner',      color: '#22c55e' },
  { value: 'intermediate', label: 'Intermediate',  color: '#f59e0b' },
  { value: 'advanced',     label: 'Advanced',      color: '#ef4444' },
]

const COST_OPTIONS = [
  { value: 'all',    label: 'Any price' },
  { value: 'budget', label: 'Under $250' },
  { value: 'mid',    label: '$250–$400' },
  { value: 'high',   label: '$400+' },
]

const SORT_OPTIONS = [
  { value: 'newest',   label: 'Newest first' },
  { value: 'cheapest', label: 'Lowest cost' },
  { value: 'name',     label: 'A–Z' },
]

interface BuildsGridProps {
  builds: DroneBuild[]
  locale: string
}

export function BuildsGrid({ builds, locale }: BuildsGridProps) {
  const [search, setSearch]         = useState('')
  const [difficulty, setDifficulty] = useState<DroneBuild['difficulty'] | 'all'>('all')
  const [cost, setCost]             = useState('all')
  const [sort, setSort]             = useState('newest')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let result = [...builds]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.useCase.toLowerCase().includes(q)
      )
    }

    // Difficulty
    if (difficulty !== 'all') {
      result = result.filter((b) => b.difficulty === difficulty)
    }

    // Cost
    if (cost === 'budget') result = result.filter((b) => b.estimatedCost < 250)
    if (cost === 'mid')    result = result.filter((b) => b.estimatedCost >= 250 && b.estimatedCost <= 400)
    if (cost === 'high')   result = result.filter((b) => b.estimatedCost > 400)

    // Sort
    if (sort === 'cheapest') result.sort((a, b) => a.estimatedCost - b.estimatedCost)
    if (sort === 'name')     result.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'newest')   result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return result
  }, [builds, search, difficulty, cost, sort])

  const hasActiveFilters = difficulty !== 'all' || cost !== 'all' || search.trim() !== ''

  const clearFilters = () => {
    setSearch('')
    setDifficulty('all')
    setCost('all')
    setSort('newest')
  }

  return (
    <div className="space-y-6">
      {/* ── Search + filter bar ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search builds…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Search builds"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
          aria-label="Sort builds"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Filter toggle */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className={[
            'flex items-center gap-2 h-10 px-4 rounded-md border text-sm font-medium transition-colors',
            filtersOpen || hasActiveFilters
              ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
              : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/40',
          ].join(' ')}
        >
          <SlidersHorizontal size={14} aria-hidden="true" />
          Filters
          {hasActiveFilters && (
            <span className="w-4 h-4 rounded-full bg-[var(--accent)] text-[var(--bg-primary)] text-[9px] font-bold flex items-center justify-center">
              {[difficulty !== 'all', cost !== 'all', search.trim() !== ''].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* ── Expanded filters ─────────────────────────────────────────────── */}
      {filtersOpen && (
        <div className="flex flex-wrap gap-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
          {/* Difficulty */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDifficulty(opt.value)}
                  className={[
                    'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                    difficulty === opt.value
                      ? 'text-white border-transparent'
                      : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/40',
                  ].join(' ')}
                  style={difficulty === opt.value ? { backgroundColor: opt.color, borderColor: opt.color } : {}}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cost */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide">Estimated cost</p>
            <div className="flex flex-wrap gap-2">
              {COST_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCost(opt.value)}
                  className={[
                    'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                    cost === opt.value
                      ? 'bg-[var(--accent)] text-[var(--bg-primary)] border-[var(--accent)]'
                      : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/40',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <div className="flex items-end ml-auto">
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-red-400 transition-colors px-2 py-1.5 rounded hover:bg-red-500/10"
              >
                <X size={12} aria-hidden="true" />
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Results count ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">
          {filtered.length === builds.length
            ? `${builds.length} builds`
            : `${filtered.length} of ${builds.length} builds`}
        </p>
        {hasActiveFilters && (
          <button onClick={clearFilters}
            className="text-xs text-[var(--accent)] hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="text-[var(--text-secondary)]">No builds match your filters.</p>
          <button onClick={clearFilters}
            className="text-sm text-[var(--accent)] hover:underline">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((build) => (
            <BuildCard key={build.id} build={build} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
