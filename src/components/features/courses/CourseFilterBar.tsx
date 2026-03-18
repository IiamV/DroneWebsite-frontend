'use client'

import { Search } from 'lucide-react'
import type { Course } from '@/types'

interface CourseFilterBarProps {
  difficulties: Course['difficulty'][]
  categories: string[]
  selectedDifficulty: string
  selectedCategory: string
  search: string
  onDifficultyChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSearchChange: (value: string) => void
}

export function CourseFilterBar({
  difficulties,
  categories,
  selectedDifficulty,
  selectedCategory,
  search,
  onDifficultyChange,
  onCategoryChange,
  onSearchChange,
}: CourseFilterBarProps) {
  return (
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
          placeholder="Search courses…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full min-h-[44px] rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          aria-label="Search courses"
        />
      </div>

      {/* Difficulty */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="difficulty-filter"
          className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide"
        >
          Difficulty
        </label>
        <select
          id="difficulty-filter"
          value={selectedDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="min-h-[44px] rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{ touchAction: 'manipulation' }}
        >
          <option value="">All levels</option>
          {difficulties.map((d) => (
            <option key={d} value={d}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="category-filter"
          className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide"
        >
          Category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="min-h-[44px] rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{ touchAction: 'manipulation' }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
