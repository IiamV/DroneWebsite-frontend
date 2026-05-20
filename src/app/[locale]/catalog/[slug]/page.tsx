import Link from 'next/link'
import { mockProducts } from '@/mocks/products'
import { getProductBySlug, getCompatibleProducts } from '@/lib/db/products'
import { ProductDetail } from '@/components/features/catalog/ProductDetail'
import { ROUTES, localePath } from '@/constants/routes'
import { setRequestLocale } from 'next-intl/server'
import { NotFoundError } from '@/lib/fetch-utils'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  let product = mockProducts.find((p) => p.slug === slug) ?? null
  let compatibleProducts = product
    ? mockProducts.filter((p) => product!.compatibleWith.includes(p.id))
    : []

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      product = await getProductBySlug(slug)
      compatibleProducts = await getCompatibleProducts(product.compatibleWith)
    }
  } catch (err) {
    if (err instanceof NotFoundError) {
      product = null
    }
  }

  if (!product) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-[var(--text-secondary)]">Product not found.</p>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[var(--text-secondary)]">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link
              href={localePath(locale, ROUTES.CATALOG)}
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

export async function generateStaticParams() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const { data } = await supabase.from('products').select('slug')
      return (data ?? []).map((p) => ({ slug: p.slug }))
    }
  } catch { /* fall through */ }
  return mockProducts.map((p) => ({ slug: p.slug }))
}
