import { createClient } from '@/lib/supabase/server'
import { toAppError, NotFoundError } from '@/lib/fetch-utils'
import type { DroneBuild, BuildStep, BuildWire } from '@/types'

function parseSteps(raw: unknown): BuildStep[] {
  if (!Array.isArray(raw)) return []
  return raw.map((s: Record<string, unknown>) => ({
    order:       s.order as number,
    title:       s.title as string,
    description: s.description as string,
    productIds:  (s.productIds as string[]) ?? [],
    wiringNote:  (s.wiringNote as string | undefined) ?? undefined,
  }))
}

function parseWires(raw: unknown): BuildWire[] {
  if (!Array.isArray(raw)) return []
  return raw.map((w: Record<string, unknown>) => ({
    fromComponent: w.fromComponent as string,
    fromPad:       w.fromPad as string,
    toComponent:   w.toComponent as string,
    toPad:         w.toPad as string,
    label:         w.label as string,
    color:         w.color as string,
  }))
}

function rowToBuild(row: Record<string, unknown>): DroneBuild {
  return {
    id:                row.id as string,
    slug:              row.slug as string,
    name:              row.name as string,
    description:       row.description as string,
    thumbnailUrl:      row.thumbnail_url as string,
    difficulty:        row.difficulty as DroneBuild['difficulty'],
    estimatedCost:     row.estimated_cost as number,
    estimatedCostVnd:  row.estimated_cost_vnd as number,
    flightTime:        row.flight_time as string,
    useCase:           row.use_case as string,
    productIds:        (row.product_ids as string[]) ?? [],
    steps:             parseSteps(row.steps),
    wires:             parseWires(row.wires),
    modelUrl:          (row.model_url as string | null) ?? null,
    createdAt:         new Date(row.created_at as string),
  }
}

export async function getBuilds(): Promise<DroneBuild[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('drone_builds')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data ?? []).map(rowToBuild)
  } catch (err) {
    throw toAppError(err)
  }
}

export async function getBuildBySlug(slug: string): Promise<DroneBuild> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('drone_builds')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) throw new NotFoundError(`Build not found: ${slug}`)
    return rowToBuild(data as Record<string, unknown>)
  } catch (err) {
    throw toAppError(err)
  }
}

export async function getBuildSlugs(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('drone_builds').select('slug')
    if (error) throw new Error(error.message)
    return (data ?? []).map((r) => (r as { slug: string }).slug)
  } catch (err) {
    throw toAppError(err)
  }
}
