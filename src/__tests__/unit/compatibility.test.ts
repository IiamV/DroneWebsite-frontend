import { describe, it, expect } from 'vitest'
import { filterCompatibleProducts } from '@/lib/compatibility'
import type { Product } from '@/types'

function makeProduct(overrides: Partial<Product> & { id: string; compatibleWith: string[] }): Product {
  return {
    slug: overrides.id,
    name: overrides.id,
    brand: 'Test',
    category: 'frame',
    thumbnailUrl: '',
    imageUrls: [],
    shortSummary: '',
    description: '',
    features: [],
    specs: {},
    tags: [],
    affiliateUrl: null,
    createdAt: new Date(),
    ...overrides,
  }
}

const A = makeProduct({ id: 'A', compatibleWith: ['B', 'C'] })
const B = makeProduct({ id: 'B', compatibleWith: ['A', 'C'] })
const C = makeProduct({ id: 'C', compatibleWith: ['A'] })
const D = makeProduct({ id: 'D', compatibleWith: [] })

const catalog = [A, B, C, D]

describe('filterCompatibleProducts', () => {
  it('returns full catalog when selection is empty', () => {
    const result = filterCompatibleProducts([], catalog)
    expect(result).toEqual(catalog)
  })

  it('returns products compatible with a single selected product', () => {
    // A.compatibleWith = ['B', 'C'] → should return B and C, not A or D
    const result = filterCompatibleProducts(['A'], catalog)
    const ids = result.map((p) => p.id)
    expect(ids).toContain('B')
    expect(ids).toContain('C')
    expect(ids).not.toContain('A')
    expect(ids).not.toContain('D')
  })

  it('never returns selected products in the result', () => {
    const result = filterCompatibleProducts(['A', 'B'], catalog)
    const ids = result.map((p) => p.id)
    expect(ids).not.toContain('A')
    expect(ids).not.toContain('B')
  })

  it('unions compatible IDs across multiple selected products', () => {
    // A.compatibleWith = ['B','C'], B.compatibleWith = ['A','C']
    // union = {B, C, A, C} = {A, B, C}; exclude selected [A, B] → result = [C]
    const result = filterCompatibleProducts(['A', 'B'], catalog)
    const ids = result.map((p) => p.id)
    expect(ids).toContain('C')
  })

  it('skips unknown selected IDs without error', () => {
    expect(() =>
      filterCompatibleProducts(['unknown-id-xyz'], catalog)
    ).not.toThrow()
    const result = filterCompatibleProducts(['unknown-id-xyz'], catalog)
    expect(result).toEqual([])
  })

  it('returns empty array when no products are compatible', () => {
    // D has no compatibleWith entries
    const result = filterCompatibleProducts(['D'], catalog)
    expect(result).toEqual([])
  })

  it('handles a product whose compatibleWith references a non-existent product', () => {
    const X = makeProduct({ id: 'X', compatibleWith: ['ghost-id'] })
    const result = filterCompatibleProducts(['X'], [X, A, B])
    // 'ghost-id' is not in the catalog, so nothing matches
    expect(result).toEqual([])
  })

  it('is pure — calling twice with same args returns equivalent results', () => {
    const r1 = filterCompatibleProducts(['A'], catalog)
    const r2 = filterCompatibleProducts(['A'], catalog)
    expect(r1).toEqual(r2)
  })
})
