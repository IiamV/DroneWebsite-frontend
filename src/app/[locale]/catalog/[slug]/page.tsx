import Link from 'next/link'
import { mockProducts } from '@/mocks/products'
import { ProductDetail } from '@/components/features/catalog/ProductDetail'
import { ROUTES } from '@/constants/routes'
import { setRequestLocale } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const product = mockProducts.find((p) => p.slug === slug)

  if (!product) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-[var(--text-secondary)]">Product not found.</p>
      </main>
    )
  }

  const compatibleProducts = mockProducts.filter((p) =>
    product.compatibleWith.includes(p.id)
  )
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
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

export function generateStaticParams() {
  return mockProducts.map((p) => ({ slug: p.slug }))
}
