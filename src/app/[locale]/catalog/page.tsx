import { setRequestLocale } from 'next-intl/server'
import { mockBuilds } from '@/mocks/builds'
import { getBuilds } from '@/lib/db/builds'
import { BuildsGrid } from '@/components/features/catalog/BuildsGrid'

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  let builds = mockBuilds
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const fetched = await getBuilds()
      if (fetched.length > 0) builds = fetched
    }
  } catch {
    // Supabase unavailable — use mock data
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">
          Drone Builds
        </h1>
        <p className="text-[var(--text-secondary)] max-w-2xl">
          Curated complete drone builds with step-by-step assembly guides, component lists, and wiring diagrams.
        </p>
      </div>
      <BuildsGrid builds={builds} locale={locale} />
    </main>
  )
}
