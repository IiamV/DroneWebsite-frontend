import { notFound } from 'next/navigation'
import Link from 'next/link'
import { mockProducts } from '@/mocks/products'
import { ProductDetail } from '@/components/features/catalog/ProductDetail'
import { ROUTES } from '@/constants/routes'

interface Props {
  params: { slug: string }
}

export default function ProductDetailPage({ params }: Props) {
  const product = mockProducts.find((p) => p.slug === params.slug)

  if (!product) {
    notFound()
  }

  const compatibleProducts = mockProducts.filter((p) =>
    product.compatibleWith.includes(p.id)
  )

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[var(--text-secondary)]">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link
              href={ROUTES.CATALOG}
              className="hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
            >
              Catalog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--text-primary)] font-medium truncate max-w-xs" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <ProductDetail product={product} compatibleProducts={compatibleProducts} />
    </main>
  )
}
