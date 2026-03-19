import { notFound } from 'next/navigation'
import { mockDocs } from '@/mocks/docs'
import { DocSidebar } from '@/components/features/docs/DocSidebar'
import { DocContent } from '@/components/features/docs/DocContent'
import { DocBreadcrumb } from '@/components/features/docs/DocBreadcrumb'

interface DocsPageProps {
  params: Promise<{ slug: string[] }>
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params
  const slugPath = slug.join('/')
  const doc = mockDocs.find((d) => d.slug.join('/') === slugPath)

  // Call notFound() before any rendering to avoid hooks count mismatch
  if (!doc) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex gap-8">
      <aside className="hidden md:block w-56 flex-shrink-0">
        <DocSidebar docs={mockDocs} currentSlug={slug} />
      </aside>
      <main className="flex-1 min-w-0">
        <div className="mb-6">
          <DocBreadcrumb slug={slug} />
        </div>
        <DocContent doc={doc} />
      </main>
    </div>
  )
}

export function generateStaticParams() {
  return mockDocs.map((doc) => ({ slug: doc.slug }))
}
