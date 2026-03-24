import { mockProducts } from '@/mocks/products'
import { ProductGrid } from '@/components/features/catalog/ProductGrid'

export default function CatalogPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">Product Catalog</h1>
        <p className="text-[var(--text-secondary)]">
          Browse drone components and use the compatibility filter to find parts that work together.
        </p>
      </div>
      <ProductGrid products={mockProducts} />
    </main>
  )
}
