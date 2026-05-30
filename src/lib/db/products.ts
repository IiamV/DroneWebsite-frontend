import { createClient } from '@/lib/supabase/server'
import { toAppError, NotFoundError } from '@/lib/fetch-utils'
import type { Product, Pad } from '@/types'

function parsePads(raw: unknown): Pad[] {
  if (!Array.isArray(raw)) return []
  return raw.map((p: Record<string, unknown>) => ({
    id: p.id as string,
    label: p.label as string,
    type: p.type as Pad['type'],
    color: p.color as string,
  }))
}

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    brand: row.brand as string,
    category: row.category as Product['category'],
    thumbnailUrl: row.thumbnail_url as string,
    imageUrls: (row.image_urls as string[]) ?? [],
    shortSummary: row.short_summary as string,
    description: row.description as string,
    features: (row.features as string[]) ?? [],
    specs: (row.specs as Record<string, string>) ?? {},
    compatibleWith: (row.compatible_with as string[]) ?? [],
    tags: (row.tags as string[]) ?? [],
    affiliateUrl: (row.affiliate_url as string | null) ?? null,
    modelUrl: (row.model_url as string | null) ?? null,
    pads: parsePads(row.pads),
    createdAt: new Date(row.created_at as string),
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return (data ?? []).map(rowToProduct)
  } catch (err) {
    throw toAppError(err)
  }
}

export async function getProductBySlug(slug: string): Promise<Product> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) throw new NotFoundError(`Product not found: ${slug}`)
    return rowToProduct(data as Record<string, unknown>)
  } catch (err) {
    throw toAppError(err)
  }
}

export async function getCompatibleProducts(productIds: string[]): Promise<Product[]> {
  if (productIds.length === 0) return []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds)

    if (error) throw new Error(error.message)
    return (data ?? []).map(rowToProduct)
  } catch (err) {
    throw toAppError(err)
  }
}
