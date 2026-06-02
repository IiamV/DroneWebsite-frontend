import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import type { DocPage } from '@/types'

const DOCS_DIR = join(process.cwd(), 'content/docs')

interface DocMeta {
  slug: string[]
  title: string
  order: number
  parentSlug: string | null
}

const DOC_TREE: DocMeta[] = [
  { slug: ['getting-started'], title: 'Getting Started', order: 1, parentSlug: null },
  { slug: ['getting-started', 'installation'], title: 'Installing the IDE', order: 1, parentSlug: 'getting-started' },
  { slug: ['getting-started', 'first-flight'], title: 'Your First Simulated Flight', order: 2, parentSlug: 'getting-started' },
  { slug: ['drone-components'], title: 'Drone Components', order: 2, parentSlug: null },
  { slug: ['drone-components', 'flight-controllers'], title: 'Flight Controllers', order: 1, parentSlug: 'drone-components' },
  { slug: ['drone-components', 'motors'], title: 'Motors & KV Ratings', order: 2, parentSlug: 'drone-components' },
  { slug: ['building-your-first-drone'], title: 'Building Your First Drone', order: 3, parentSlug: null },
  { slug: ['betaflight-setup'], title: 'Betaflight Setup Guide', order: 4, parentSlug: null },
  { slug: ['simulator-guide'], title: 'Simulator Guide', order: 5, parentSlug: null },
  { slug: ['simulator-guide', 'telemetry'], title: 'Telemetry & Blackbox', order: 1, parentSlug: 'simulator-guide' },
]

const DOC_TREE_VI: Record<string, string> = {
  'getting-started': 'Bắt đầu',
  'getting-started/installation': 'Cài đặt IDE',
  'getting-started/first-flight': 'Chuyến bay mô phỏng đầu tiên',
  'drone-components': 'Linh kiện Drone',
  'drone-components/flight-controllers': 'Bộ điều khiển bay',
  'drone-components/motors': 'Động cơ & Chỉ số KV',
  'building-your-first-drone': 'Lắp ráp Drone đầu tiên',
  'betaflight-setup': 'Hướng dẫn cài đặt Betaflight',
  'simulator-guide': 'Hướng dẫn mô phỏng',
  'simulator-guide/telemetry': 'Telemetry & Blackbox',
}

function readDocContent(locale: string, slug: string[]): string {
  const filePath = join(DOCS_DIR, locale, ...slug) + '.md'
  if (existsSync(filePath)) {
    return readFileSync(filePath, 'utf8')
  }
  const fallback = join(DOCS_DIR, 'en', ...slug) + '.md'
  if (existsSync(fallback)) {
    return readFileSync(fallback, 'utf8')
  }
  return ''
}

export function getDocs(locale: string): DocPage[] {
  return DOC_TREE.map((meta) => {
    const slugKey = meta.slug.join('/')
    const title = locale === 'vi' ? (DOC_TREE_VI[slugKey] ?? meta.title) : meta.title
    return {
      id: slugKey,
      slug: meta.slug,
      title,
      content: readDocContent(locale, meta.slug),
      order: meta.order,
      parentSlug: meta.parentSlug,
      updatedAt: new Date('2024-03-15'),
    }
  })
}

export function getDocBySlug(locale: string, slugSegments: string[]): DocPage | null {
  const slugKey = slugSegments.join('/')
  const meta = DOC_TREE.find((d) => d.slug.join('/') === slugKey)
  if (!meta) return null

  const content = readDocContent(locale, slugSegments)
  if (!content) return null

  const title = locale === 'vi' ? (DOC_TREE_VI[slugKey] ?? meta.title) : meta.title
  return {
    id: slugKey,
    slug: meta.slug,
    title,
    content,
    order: meta.order,
    parentSlug: meta.parentSlug,
    updatedAt: new Date('2024-03-15'),
  }
}
