import { mockTiers } from '@/mocks/tiers'
import { VNPayCheckoutForm } from '@/components/features/subscription/VNPayCheckoutForm'
import { Badge } from '@/components/ui/badge'

interface CheckoutPageProps {
  params: { tierId: string }
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const tier = mockTiers.find((t) => t.id === params.tierId)

  if (!tier || tier.price === 0) {
    return (
      <main className="max-w-md mx-auto px-4 py-12 text-center">
        <p className="text-[var(--text-secondary)]">Plan not found.</p>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Checkout</h1>
          <Badge variant="outline" style={{ borderColor: tier.badgeColor, color: tier.badgeColor }}>{tier.badgeLabel}</Badge>
        </div>
        <p className="text-[var(--text-secondary)] text-sm">
          You&apos;re subscribing to the <strong>{tier.name}</strong> plan.
        </p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 shadow-sm">
        <VNPayCheckoutForm tier={tier} />
      </div>
    </main>
  )
}

export function generateStaticParams() {
  return mockTiers.filter((t) => t.price > 0).map((t) => ({ tierId: t.id }))
}
