import { z } from 'zod'

export const DownloadQuerySchema = z.object({
  platform: z.enum(['windows', 'mac', 'linux', 'all']).optional(),
})

export type DownloadQueryInput = z.infer<typeof DownloadQuerySchema>
