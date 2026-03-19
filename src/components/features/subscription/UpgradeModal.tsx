'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TierComparisonTable } from './TierComparisonTable'
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
    router.push(`${ROUTES.SUBSCRIPTION_CHECKOUT}/${tier.id}`)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Upgrade your plan</DialogTitle>
          <DialogDescription>
            {requiredTier
              ? `This content requires the ${requiredTier.name} plan or higher.`
              : 'Unlock this content by upgrading your subscription.'}
          </DialogDescription>
        </DialogHeader>

        <TierComparisonTable tiers={mockTiers} currentTierId={currentTierId} onSelectTier={handleSelectTier} />

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Maybe later</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
