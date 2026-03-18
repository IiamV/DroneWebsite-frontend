'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { SubscriptionTier } from '@/types'

interface VNPayCheckoutFormProps {
  tier: SubscriptionTier
}

export function VNPayCheckoutForm({ tier }: VNPayCheckoutFormProps) {
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // No backend call yet — placeholder
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-4">🔒</div>
        <p className="text-[var(--text-secondary)]">
          Payment integration will be available after backend setup.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="cardholder-name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          Cardholder name
        </label>
        <Input
          id="cardholder-name"
          type="text"
          placeholder="Nguyen Van A"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="card-number" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          Card number
        </label>
        <Input
          id="card-number"
          type="text"
          placeholder="9704 0000 0000 0018"
          inputMode="numeric"
          autoComplete="cc-number"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiry" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Expiry
          </label>
          <Input id="expiry" type="text" placeholder="MM/YY" autoComplete="cc-exp" />
        </div>
        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            CVV
          </label>
          <Input id="cvv" type="text" placeholder="123" autoComplete="cc-csc" />
        </div>
      </div>

      {/* Order summary */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm">
        <div className="flex justify-between text-[var(--text-secondary)] mb-1">
          <span>{tier.name} plan</span>
          <span>
            {tier.price === 0
              ? 'Free'
              : `$${tier.price.toFixed(2)}/${tier.billingCycle === 'monthly' ? 'mo' : 'yr'}`}
          </span>
        </div>
        <div className="flex justify-between font-semibold text-[var(--text-primary)] border-t border-[var(--border)] pt-2 mt-2">
          <span>Total</span>
          <span>{tier.price === 0 ? 'Free' : `$${tier.price.toFixed(2)}`}</span>
        </div>
      </div>

      <Button type="submit" variant="primary" className="w-full">
        Pay with VNPay
      </Button>

      <p className="text-xs text-center text-[var(--text-secondary)]">
        Secured by VNPay. Your payment details are encrypted.
      </p>
    </form>
  )
}
