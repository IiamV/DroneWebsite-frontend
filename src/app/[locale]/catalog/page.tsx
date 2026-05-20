import { DroneBuilder } from '@/components/features/catalog/DroneBuilder'
import { setRequestLocale } from 'next-intl/server'
import { getProducts } from '@/lib/db/products'
import { mockProducts } from '@/mocks/products'

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  // Fall back to mock data if Supabase is not configured
  let products = mockProducts
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const fetched = await getProducts()
      if (fetched.length > 0) products = fetched
    }
  } catch (err) {
    console.error('[catalog] Supabase fetch failed, using mock data:', err)
  }

  return <DroneBuilder products={products} />
}
