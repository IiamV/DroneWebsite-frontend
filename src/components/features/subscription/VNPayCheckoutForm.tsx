'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SubscriptionTier } from '@/types'

export function VNPayCheckoutForm({ tier }: { tier: SubscriptionTier }) {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Lock size={22} />
          </div>
        </div>
        <p className="text-muted-foreground">Payment integration will be available after backend setup.</p>
      </div>
    )
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cardholder-name">Cardholder name</Label>
        <Input id="cardholder-name" type="text" placeholder="Nguyen Van A" required autoComplete="name" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="card-number">Card number</Label>
        <Input id="card-number" type="text" placeholder="9704 0000 0000 0018" inputMode="numeric" autoComplete="cc-number" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expiry">Expiry</Label>
          <Input id="expiry" type="text" placeholder="MM/YY" autoComplete="cc-exp" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cvv">CVV</Label>
          <Input id="cvv" type="text" placeholder="123" autoComplete="cc-csc" />
        </div>
      </div>
      <div className="rounded-lg border bg-muted/50 p-4 text-sm">
        <div className="flex justify-between text-muted-foreground mb-1">
          <span>{tier.name} plan</span>
          <span>{tier.price === 0 ? 'Free' : `$${tier.price.toFixed(2)}/${tier.billingCycle === 'monthly' ? 'mo' : 'yr'}`}</span>
        </div>
        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
          <span>Total</span>
          <span>{tier.price === 0 ? 'Free' : `$${tier.price.toFixed(2)}`}</span>
        </div>
      </div>
      <Button type="submit" className="w-full" size="lg">Pay with VNPay</Button>
      <p className="text-xs text-center text-muted-foreground">Secured by VNPay. Your payment details are encrypted.</p>
    </form>
  )
}
