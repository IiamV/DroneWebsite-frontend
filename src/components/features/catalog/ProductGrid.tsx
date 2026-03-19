'use client'

import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { AssemblyFilter } from './AssemblyFilter'
import { filterCompatibleProducts } from '@/lib/compatibility'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis,
} from '@/components/ui/pagination'
import type { Product } from '@/types'

const PAGE_SIZE = 9

const CATEGORY_LABELS: Record<Product['category'], string> = {
  frame: 'Frame', motor: 'Motor', esc: 'ESC',
  flight_controller: 'Flight Controller', propeller: 'Propeller',
  battery: 'Battery', camera: 'Camera', complete_drone: 'Complete Drone',
}

export function ProductGrid({ products }: { products: Product[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const categories = Array.from(new Set(products.map((p) => p.category))) as Product['category'][]

  const toggleProduct = useCallback((id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
    setPage(1)
  }, [])

  const clearFilter = useCallback(() => { setSelectedIds([]); setPage(1) }, [])

  const compatible = filterCompatibleProducts(selectedIds, products)

  const displayed = compatible.filter((p) => {
    if (categoryFilter && p.category !== categoryFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = displayed.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const selectedProducts = products.filter((p) => selectedIds.includes(p.id))

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <AssemblyFilter selectedProducts={selectedProducts} onRemove={toggleProduct} onClear={clearFilter} />

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-9"
              aria-label="Search products"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <Button
              variant={categoryFilter === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter('')}
            >All</Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setCategoryFilter(cat === categoryFilter ? '' : cat); setPage(1) }}
              >{CATEGORY_LABELS[cat]}</Button>
            ))}
          </div>
        </div>

        {displayed.length === 0 ? (
          <p className="text-muted-foreground text-center py-16">No products match your search.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginated.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  inBuild={selectedIds.includes(product.id)}
                  onToggleBuild={toggleProduct}
                />
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
                          <PaginationLink href="#" isActive={p === safePage} onClick={(e) => { e.preventDefault(); setPage(p) }}>
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
    </div>
  )
}
