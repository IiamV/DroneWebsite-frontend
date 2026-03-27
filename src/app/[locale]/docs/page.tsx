import { mockDocs } from '@/mocks/docs'
import { DocSidebar } from '@/components/features/docs/DocSidebar'
import { DocContent } from '@/components/features/docs/DocContent'
import { DocBreadcrumb } from '@/components/features/docs/DocBreadcrumb'
import { setRequestLocale } from 'next-intl/server'

export default async function DocsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  // Render the first doc (getting-started) directly at /docs
  const doc = mockDocs[0]

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex gap-8">
      <aside className="hidden md:block w-56 flex-shrink-0">
        <DocSidebar docs={mockDocs} currentSlug={doc.slug} />
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
