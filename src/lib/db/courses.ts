import { createClient } from '@/lib/supabase/server'
import { toAppError, NotFoundError } from '@/lib/fetch-utils'
import type { Course, CourseModule } from '@/types'

function rowToModule(row: Record<string, unknown>): CourseModule {
  return {
    id: row.id as string,
    courseId: row.course_id as string,
    title: row.title as string,
    videoUrl: (row.video_url as string | null) ?? null,
    content: row.content as string,
    order: row.order as number,
  }
}

function rowToCourse(row: Record<string, unknown>, modules: CourseModule[]): Course {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    description: row.description as string,
    thumbnailUrl: row.thumbnail_url as string,
    category: row.category as string,
    difficulty: row.difficulty as Course['difficulty'],
    durationMinutes: row.duration_minutes as number,
    requiredTier: row.required_tier as string,
    modules,
    createdAt: new Date(row.created_at as string),
  }
}

export async function getCourses(): Promise<Course[]> {
  try {
    const supabase = await createClient()
    const { data: courseRows, error: courseErr } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true })

    if (courseErr) throw new Error(courseErr.message)
    if (!courseRows?.length) return []

    const courseIds = courseRows.map((c: any) => c.id)
    const { data: moduleRows, error: moduleErr } = await supabase
      .from('course_modules')
      .select('*')
      .in('course_id', courseIds)
      .order('order', { ascending: true })

    if (moduleErr) throw new Error(moduleErr.message)

    return courseRows.map((c: any) => {
      const modules = (moduleRows ?? [])
        .filter((m: any) => m.course_id === c.id)
        .map((m) => rowToModule(m as Record<string, unknown>))
      return rowToCourse(c as Record<string, unknown>, modules)
    })
  } catch (err) {
    throw toAppError(err)
  }
}

export async function getCourseBySlug(slug: string): Promise<Course> {
  try {
    const supabase = await createClient()
    const { data: courseRow, error: courseErr } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single()

    if (courseErr || !courseRow) throw new NotFoundError(`Course not found: ${slug}`)

    const { data: moduleRows, error: moduleErr } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', (courseRow as any).id)
      .order('order', { ascending: true })

    if (moduleErr) throw new Error(moduleErr.message)

    const modules = (moduleRows ?? []).map((m) => rowToModule(m as Record<string, unknown>))
    return rowToCourse(courseRow as Record<string, unknown>, modules)
  } catch (err) {
    throw toAppError(err)
  }
}

export async function getCourseSlugs(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('courses').select('slug')
    if (error) throw new Error(error.message)
    return (data ?? []).map((r: any) => r.slug)
  } catch (err) {
    throw toAppError(err)
  }
}
