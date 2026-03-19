'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
    <div className="flex flex-col sm:flex-row gap-3 mb-6 items-end">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search courses…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Search courses"
        />
      </div>

      {/* Difficulty */}
      <div className="flex flex-col gap-1 min-w-[140px]">
        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
          Difficulty
        </label>
        <Select value={selectedDifficulty || '__all__'} onValueChange={(v) => onDifficultyChange(v === '__all__' ? '' : v)}>
          <SelectTrigger aria-label="Filter by difficulty">
            <SelectValue placeholder="All levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All levels</SelectItem>
            {difficulties.map((d) => (
              <SelectItem key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1 min-w-[160px]">
        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
          Category
        </label>
        <Select value={selectedCategory || '__all__'} onValueChange={(v) => onCategoryChange(v === '__all__' ? '' : v)}>
          <SelectTrigger aria-label="Filter by category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
