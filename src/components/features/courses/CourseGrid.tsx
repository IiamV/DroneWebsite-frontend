'use client'

import { useState } from 'react'
import { CourseCard } from './CourseCard'
import { CourseFilterBar } from './CourseFilterBar'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { PAGE_SIZE } from '@/constants/pagination'
import type { Course } from '@/types'

interface CourseGridProps {
  courses: Course[]
}

export function CourseGrid({ courses }: CourseGridProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div>
      <CourseFilterBar
        difficulties={difficulties}
        categories={categories}
        selectedDifficulty={selectedDifficulty}
        selectedCategory={selectedCategory}
        search={search}
        onDifficultyChange={(v) => { setSelectedDifficulty(v); setPage(1) }}
        onCategoryChange={(v) => { setSelectedCategory(v); setPage(1) }}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
      />

      {filtered.length === 0 ? (
        <p className="text-[var(--text-secondary)] text-center py-12">
          No courses match your search.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)) }}
                      aria-disabled={safePage === 1}
                      className={safePage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    if (totalPages > 7 && p !== 1 && p !== totalPages && Math.abs(p - safePage) > 2) {
                      if (p === 2 || p === totalPages - 1) return <PaginationItem key={p}><PaginationEllipsis /></PaginationItem>
                      return null
                    }
                    return (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === safePage}
                          onClick={(e) => { e.preventDefault(); setPage(p) }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)) }}
                      aria-disabled={safePage === totalPages}
                      className={safePage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}
