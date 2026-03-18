import type { Product } from '@/types'

/**
 * Filters the product catalog to items compatible with the selected products.
 * Pure and stateless — no module-level mutable state.
 *
 * - Empty selection → returns full catalog unchanged.
 * - Non-empty selection → returns products whose IDs appear in the `compatibleWith`
 *   list of at least one selected product, excluding the selected products themselves.
 * - Unknown selected IDs are silently skipped.
 */
export function filterCompatibleProducts(
  selectedProductIds: string[],
  allProducts: Product[]
): Product[] {
  if (selectedProductIds.length === 0) {
    return allProducts
  }

  const compatibleIds = new Set<string>()

  for (const id of selectedProductIds) {
    const product = allProducts.find((p) => p.id === id)
    if (product) {
      for (const compatId of product.compatibleWith) {
        compatibleIds.add(compatId)
      }
    }
  }

  const selectedSet = new Set(selectedProductIds)

  return allProducts.filter(
    (p) => compatibleIds.has(p.id) && !selectedSet.has(p.id)
  )
}
