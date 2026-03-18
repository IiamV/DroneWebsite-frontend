import { z } from 'zod'

export const ProductQuerySchema = z.object({
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  cursor: z.string().optional(),
  limit: z.number().default(20),
})

export type ProductQueryInput = z.infer<typeof ProductQuerySchema>
