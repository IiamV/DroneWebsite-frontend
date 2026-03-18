'use client'

import { useState } from 'react'
import { CourseCard } from './CourseCard'
import { CourseFilterBar } from './CourseFilterBar'
import type { Course } from '@/types'

interface CourseGridProps {
  courses: Course[]
}

export function CourseGrid({ courses }: CourseGridProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [search, setSearch] = useState('')

  const difficulties = Array.from(new Set(courses.map((c) => c.difficulty))) as Course['difficulty'][]
  const categories = Array.from(new Set(courses.map((c) => c.category)))

  const filtered = courses.filter((c) => {
    if (selectedDifficulty && c.difficulty !== selectedDifficulty) return false
    if (selectedCategory && c.category !== selectedCategory) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div>
      <CourseFilterBar
        difficulties={difficulties}
        categories={categories}
        selectedDifficulty={selectedDifficulty}
        selectedCategory={selectedCategory}
        search={search}
        onDifficultyChange={setSelectedDifficulty}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearch}
      />

      {filtered.length === 0 ? (
        <p className="text-[var(--text-secondary)] text-center py-12">
          No courses match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
