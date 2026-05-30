import Link from 'next/link'
import { mockBuilds } from '@/mocks/builds'
import { mockProducts } from '@/mocks/products'
import { getBuildBySlug } from '@/lib/db/builds'
import { getProducts } from '@/lib/db/products'
import { BuildDetail } from '@/components/features/catalog/BuildDetail'
import { ProductDetail } from '@/components/features/catalog/ProductDetail'
import { ROUTES, localePath } from '@/constants/routes'
import { setRequestLocale } from 'next-intl/server'
import { NotFoundError } from '@/lib/fetch-utils'

// Force dynamic rendering so the Supabase client (which uses cookies) works at runtime
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function CatalogDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  // ── Try build slug first ───────────────────────────────────────────────
  let build = mockBuilds.find((b) => b.slug === slug) ?? null
  let allProducts = mockProducts

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Try to get the build from Supabase — keep mock if not found or on error
      try {
        const dbBuild = await getBuildBySlug(slug)
        build = dbBuild  // only overwrite mock if Supabase succeeds
      } catch (err) {
        // NotFoundError = slug not in DB yet, keep mock build
        // Any other error = Supabase unavailable, keep mock build
        if (!(err instanceof NotFoundError)) {
          console.warn('getBuildBySlug failed, using mock:', err)
        }
      }
      // Try to get products from Supabase
      try {
        const fetched = await getProducts()
        if (fetched.length > 0) allProducts = fetched
      } catch {
        // keep mockProducts
      }
    }
  } catch { /* keep mocks */ }

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
