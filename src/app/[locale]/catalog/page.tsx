import { getTranslations } from 'next-intl/server'
import { unstable_noStore as noStore } from 'next/cache'
import { getBuilds } from '@/lib/db/builds'
import { BuildsGrid } from '@/components/features/catalog/BuildsGrid'

export const dynamic = 'force-dynamic'

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  noStore()
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'builds' })

  const builds = await getBuilds(locale)

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">
          {t('title')}
        </h1>
        <p className="text-[var(--text-secondary)] max-w-2xl">
          {t('subtitle')}
        </p>
      </div>
      <BuildsGrid builds={builds} locale={locale} />
    </main>
  )
}
