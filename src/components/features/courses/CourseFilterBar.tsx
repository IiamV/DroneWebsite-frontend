'use client'

import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('courses')

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          aria-label={t('searchLabel')}
        />
      </div>

      {/* Difficulty */}
      <div className="flex flex-col gap-1 min-w-[140px]">
        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
          {t('difficulty')}
        </label>
        <Select value={selectedDifficulty || '__all__'} onValueChange={(v) => onDifficultyChange(v === '__all__' ? '' : v)}>
          <SelectTrigger aria-label={t('difficulty')}>
            <SelectValue placeholder={t('allLevels')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{t('allLevels')}</SelectItem>
            {difficulties.map((d) => (
              <SelectItem key={d} value={d}>
                {t(d)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1 min-w-[160px]">
        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
          {t('category')}
        </label>
        <Select value={selectedCategory || '__all__'} onValueChange={(v) => onCategoryChange(v === '__all__' ? '' : v)}>
          <SelectTrigger aria-label={t('category')}>
            <SelectValue placeholder={t('allCategories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{t('allCategories')}</SelectItem>
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
