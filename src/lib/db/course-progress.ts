import { createClient } from '@/lib/supabase/server'
import { toAppError } from '@/lib/fetch-utils'
import type { CompletedCourse, Course } from '@/types'

type Locale = 'en' | 'vi' | string

function localized(row: Record<string, unknown>, key: string, locale: Locale): string {
  if (locale === 'vi') {
    const viValue = row[`${key}_vi`]
    if (typeof viValue === 'string' && viValue.trim()) return viValue
  }
  return (row[key] as string) ?? ''
}

export async function getCompletedCourses(locale: Locale = 'en'): Promise<CompletedCourse[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: progressRows, error: progressError } = await supabase
      .from('course_progress')
      .select('course_id, completed, progress_percent, updated_at')
      .eq('user_id', user.id)
      .eq('completed', true)
      .order('updated_at', { ascending: false })

    if (progressError) throw new Error(progressError.message)
    if (!progressRows?.length) return []

    const grouped = new Map<string, { completedModules: number; progressPercent: number; completedAt: Date }>()
    for (const row of progressRows as Array<Record<string, unknown>>) {
      const courseId = row.course_id as string
      const existing = grouped.get(courseId)
      const updatedAt = new Date(row.updated_at as string)
      grouped.set(courseId, {
        completedModules: (existing?.completedModules ?? 0) + 1,
        progressPercent: Math.max(existing?.progressPercent ?? 0, (row.progress_percent as number) ?? 0),
        completedAt: existing && existing.completedAt > updatedAt ? existing.completedAt : updatedAt,
      })
    }

    const courseIds = Array.from(grouped.entries())
      .filter(([, meta]) => meta.progressPercent >= 100)
      .map(([courseId]) => courseId)

    if (!courseIds.length) return []

    const { data: courseRows, error: courseError } = await supabase
      .from('courses')
      .select('id, slug, title, title_vi, description, description_vi, category, category_vi, difficulty')
      .in('id', courseIds)

    if (courseError) throw new Error(courseError.message)

    return (courseRows ?? []).map((row) => {
      const meta = grouped.get((row as Record<string, unknown>).id as string)
      return {
        id: (row as Record<string, unknown>).id as string,
        slug: (row as Record<string, unknown>).slug as string,
        title: localized(row as Record<string, unknown>, 'title', locale),
        description: localized(row as Record<string, unknown>, 'description', locale),
        category: localized(row as Record<string, unknown>, 'category', locale),
        difficulty: (row as Record<string, unknown>).difficulty as Course['difficulty'],
        completedModules: meta?.completedModules ?? 0,
        progressPercent: meta?.progressPercent ?? 100,
        completedAt: meta?.completedAt ?? new Date(),
      }
    }).sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
  } catch (err) {
    throw toAppError(err)
  }
}
