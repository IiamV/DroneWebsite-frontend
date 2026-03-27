import { mockProducts } from '@/mocks/products'
import { ProductGrid } from '@/components/features/catalog/ProductGrid'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('catalog')

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">{t('title')}</h1>
        <p className="text-[var(--text-secondary)]">{t('subtitle')}</p>
      </div>
      <ProductGrid products={mockProducts} />
    </main>
  )
}
