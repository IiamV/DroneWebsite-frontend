import { createClient } from '@/lib/supabase/server'
import { toAppError, NotFoundError } from '@/lib/fetch-utils'
import type { Course, CourseModule, CourseQuizQuestion } from '@/types'

type Locale = 'en' | 'vi' | string

function localized(row: Record<string, unknown>, key: string, locale: Locale): string {
  if (locale === 'vi') {
    const viValue = row[`${key}_vi`]
    if (typeof viValue === 'string' && viValue.trim()) return viValue
  }
  return (row[key] as string) ?? ''
}

function normalizeQuiz(value: unknown, locale: Locale): CourseQuizQuestion[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    const row = item as Record<string, unknown>
    const localizedQuestion = locale === 'vi' && typeof row.questionVi === 'string'
      ? row.questionVi
      : row.question
    const localizedOptions = locale === 'vi' && Array.isArray(row.optionsVi)
      ? row.optionsVi
      : row.options
    const localizedExplanation = locale === 'vi' && typeof row.explanationVi === 'string'
      ? row.explanationVi
      : row.explanation

    if (
      typeof row.id !== 'string' ||
      typeof localizedQuestion !== 'string' ||
      !Array.isArray(localizedOptions) ||
      typeof row.answerIndex !== 'number'
    ) {
      return []
    }

    return [{
      id: row.id,
      question: localizedQuestion,
      options: localizedOptions.filter((option): option is string => typeof option === 'string'),
      answerIndex: row.answerIndex,
      explanation: typeof localizedExplanation === 'string' ? localizedExplanation : '',
    }]
  })
}

function rowToModule(row: Record<string, unknown>, locale: Locale): CourseModule {
  return {
    id: row.id as string,
    courseId: row.course_id as string,
    title: localized(row, 'title', locale),
    videoUrl: (row.video_url as string | null) ?? null,
    content: localized(row, 'content', locale),
    lessonType: (row.lesson_type as CourseModule['lessonType'] | undefined) ?? 'lesson',
    quiz: normalizeQuiz(row.quiz, locale),
    order: row.order as number,
  }
}

function rowToCourse(row: Record<string, unknown>, modules: CourseModule[], locale: Locale): Course {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: localized(row, 'title', locale),
    description: localized(row, 'description', locale),
    thumbnailUrl: row.thumbnail_url as string,
    category: localized(row, 'category', locale),
    difficulty: row.difficulty as Course['difficulty'],
    durationMinutes: row.duration_minutes as number,
    requiredTier: row.required_tier as string,
    modules,
    createdAt: new Date(row.created_at as string),
  }
}

export async function getCourses(locale: Locale = 'en'): Promise<Course[]> {
  try {
    const supabase = await createClient()
    const { data: courseRows, error: courseErr } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true })

    if (courseErr) throw new Error(courseErr.message)
    if (!courseRows?.length) return []

    return courseRows.map((row) => rowToCourse(row as Record<string, unknown>, [], locale))
  } catch (err) {
    throw toAppError(err)
  }
}

export async function getCourseBySlug(slug: string, locale: Locale = 'en'): Promise<Course> {
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

    if (moduleErr) {
      if (moduleErr.message.toLowerCase().includes('permission denied')) {
        return rowToCourse(courseRow as Record<string, unknown>, [], locale)
      }
      throw new Error(moduleErr.message)
    }

    const modules = (moduleRows ?? []).map((m) => rowToModule(m as Record<string, unknown>, locale))
    return rowToCourse(courseRow as Record<string, unknown>, modules, locale)
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
