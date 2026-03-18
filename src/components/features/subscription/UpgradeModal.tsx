'use client'

import { Modal } from '@/components/ui/Modal'
import { TierComparisonTable } from './TierComparisonTable'
import { Button } from '@/components/ui/Button'
import { mockTiers } from '@/mocks/tiers'
import { useRouter } from 'next/navigation'
import type { SubscriptionTier } from '@/types'
import { ROUTES } from '@/constants/routes'

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  currentTierId?: string
  requiredTier?: SubscriptionTier
}

export function UpgradeModal({ open, onClose, currentTierId, requiredTier }: UpgradeModalProps) {
  const router = useRouter()

  function handleSelectTier(tier: SubscriptionTier) {
    if (tier.price === 0) return
    onClose()
    router.push(`${ROUTES.SUBSCRIPTION_CHECKOUT}?tierId=${tier.id}`)
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-4xl w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Upgrade your plan</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          {requiredTier
            ? `This content requires the ${requiredTier.name} plan or higher.`
            : 'Unlock this content by upgrading your subscription.'}
        </p>
      </div>

      <TierComparisonTable
        tiers={mockTiers}
        currentTierId={currentTierId}
        onSelectTier={handleSelectTier}
      />

      <div className="mt-6 flex justify-end">
        <Button variant="ghost" onClick={onClose}>
          Maybe later
        </Button>
      </div>
    </Modal>
  )
}
