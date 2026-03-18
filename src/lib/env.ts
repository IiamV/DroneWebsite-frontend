import { z } from 'zod'

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  VNP_TMN_CODE: z.string().min(1),
  VNP_HASH_SECRET: z.string().min(1),
  VNP_URL: z.string().url(),
})

export const env = EnvSchema.parse(process.env)
