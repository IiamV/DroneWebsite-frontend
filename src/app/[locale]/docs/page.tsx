import { getDocs } from '@/lib/docs'
import { DocSidebar } from '@/components/features/docs/DocSidebar'
import { DocContent } from '@/components/features/docs/DocContent'
import { DocBreadcrumb } from '@/components/features/docs/DocBreadcrumb'
import { unstable_noStore as noStore } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function DocsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  noStore()
  const { locale } = await params

  const docs = getDocs(locale)
  const doc = docs[0]

  if (!doc) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-[var(--text-secondary)]">No documentation available.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex gap-8">
      <aside className="hidden md:block w-56 flex-shrink-0">
        <DocSidebar docs={docs} currentSlug={doc.slug} />
      </aside>
      <main className="flex-1 min-w-0">
        <div className="mb-6">
          <DocBreadcrumb slug={doc.slug} />
        </div>
        <DocContent doc={doc} locale={locale} />
      </main>
    </div>
  )
}
