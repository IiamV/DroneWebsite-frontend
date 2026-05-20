import { createClient } from '@/lib/supabase/server'
import { toAppError, NotFoundError } from '@/lib/fetch-utils'
import type { DocPage } from '@/types'

function rowToDoc(row: Record<string, unknown>): DocPage {
  return {
    id: row.id as string,
    slug: row.slug as string[],
    title: row.title as string,
    content: row.content as string,
    order: row.order as number,
    parentSlug: (row.parent_slug as string | null) ?? null,
    updatedAt: new Date(row.updated_at as string),
  }
}

export async function getDocs(): Promise<DocPage[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('doc_pages')
      .select('*')
      .order('order', { ascending: true })

    if (error) throw new Error(error.message)
    return (data ?? []).map(rowToDoc)
  } catch (err) {
    throw toAppError(err)
  }
}

export async function getDocBySlug(slugSegments: string[]): Promise<DocPage> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('doc_pages')
      .select('*')
      .eq('slug', slugSegments)
      .single()

    if (error || !data) throw new NotFoundError(`Doc not found: ${slugSegments.join('/')}`)
    return rowToDoc(data as Record<string, unknown>)
  } catch (err) {
    throw toAppError(err)
  }
}
