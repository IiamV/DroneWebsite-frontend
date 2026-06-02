import Link from 'next/link'
import { getBuildBySlug } from '@/lib/db/builds'
import { getProducts } from '@/lib/db/products'
import { BuildDetail } from '@/components/features/catalog/BuildDetail'
import { ProductDetail } from '@/components/features/catalog/ProductDetail'
import { ROUTES, localePath } from '@/constants/routes'
import { setRequestLocale } from 'next-intl/server'
import { NotFoundError } from '@/lib/fetch-utils'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function CatalogDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  let build = null
  try {
    build = await getBuildBySlug(slug, locale)
  } catch (err) {
    if (!(err instanceof NotFoundError)) throw err
  }

  const allProducts = await getProducts()

  if (build) {
    return (
      <>
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 pt-8 text-sm text-[var(--text-secondary)]">
          <ol className="flex items-center gap-2 flex-wrap">
            <li>
              <Link
                href={localePath(locale, ROUTES.CATALOG)}
                className="hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
              >
                Builds
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--text-primary)] font-medium truncate max-w-xs" aria-current="page">
              {build.name}
            </li>
          </ol>
        </nav>
        <BuildDetail build={build} products={allProducts} />
      </>
    )
  }

  // ── Fall back to product detail ────────────────────────────────────────
  const product = allProducts.find((p) => p.slug === slug) ?? null
  const compatibleProducts = product
    ? allProducts.filter((p) => product.compatibleWith.includes(p.id))
    : []

  if (!product) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-[var(--text-secondary)]">Not found.</p>
        <Link
          href={localePath(locale, ROUTES.CATALOG)}
          className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline"
        >
          ← Back to builds
        </Link>
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
              Builds
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
