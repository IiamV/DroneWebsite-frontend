import { getDocs, getDocBySlug } from '@/lib/docs'
import { DocSidebar } from '@/components/features/docs/DocSidebar'
import { DocContent } from '@/components/features/docs/DocContent'
import { DocBreadcrumb } from '@/components/features/docs/DocBreadcrumb'
import { setRequestLocale } from 'next-intl/server'
import { unstable_noStore as noStore } from 'next/cache'

export const dynamic = 'force-dynamic'

interface DocsPageProps {
  params: Promise<{ locale: string; slug: string[] }>
}

export default async function DocsPage({ params }: DocsPageProps) {
  noStore()
  const { locale, slug } = await params
  setRequestLocale(locale)

  const docs = getDocs(locale)
  const doc = getDocBySlug(locale, slug)

  if (!doc) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-[var(--text-secondary)]">Page not found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex gap-8">
      <aside className="hidden md:block w-56 flex-shrink-0">
        <DocSidebar docs={docs} currentSlug={slug} />
      </aside>
      <main className="flex-1 min-w-0">
        <div className="mb-6">
          <DocBreadcrumb slug={slug} />
        </div>
        <DocContent doc={doc} locale={locale} />
      </main>
    </div>
  )
}
