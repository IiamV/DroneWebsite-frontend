import { z } from 'zod'

export const CourseProgressSchema = z.object({
  moduleId: z.string(),
  completed: z.boolean(),
  progressPercent: z.number().min(0).max(100),
})

export type CourseProgressInput = z.infer<typeof CourseProgressSchema>
