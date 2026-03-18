import { z } from 'zod'

export const CheckoutSchema = z.object({
  tierId: z.string(),
})

export type CheckoutInput = z.infer<typeof CheckoutSchema>
