import { mockDocs } from '@/mocks/docs'
import { getDocs, getDocBySlug } from '@/lib/db/docs'
import { DocSidebar } from '@/components/features/docs/DocSidebar'
import { DocContent } from '@/components/features/docs/DocContent'
import { DocBreadcrumb } from '@/components/features/docs/DocBreadcrumb'
import { setRequestLocale } from 'next-intl/server'
import { NotFoundError } from '@/lib/fetch-utils'

interface DocsPageProps {
  params: Promise<{ locale: string; slug: string[] }>
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  let docs = mockDocs
  let doc = mockDocs.find((d) => d.slug.join('/') === slug.join('/')) ?? null

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      docs = await getDocs()
      doc = await getDocBySlug(slug)
    }
  } catch (err) {
    if (err instanceof NotFoundError) doc = null
  }

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

export async function generateStaticParams() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const docs = await getDocs()
      return docs.map((doc) => ({ slug: doc.slug }))
    }
  } catch { /* fall through */ }
  return mockDocs.map((doc) => ({ slug: doc.slug }))
}
