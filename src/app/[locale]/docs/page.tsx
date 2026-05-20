import { mockDocs } from '@/mocks/docs'
import { getDocs } from '@/lib/db/docs'
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

  let docs = mockDocs
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      docs = await getDocs()
    }
  } catch { /* use mock */ }

  const doc = docs[0]

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
