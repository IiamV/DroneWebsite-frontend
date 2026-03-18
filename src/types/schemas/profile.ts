import { z } from 'zod'

export const ProfileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.union([z.string().url(), z.literal('')]).optional(),
})

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>
