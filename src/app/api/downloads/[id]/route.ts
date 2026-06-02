import { NextRequest, NextResponse } from 'next/server'
import { getDownloads, getDownloadSignedUrl } from '@/lib/db/downloads'
import { getUserTier } from '@/lib/db/subscriptions'
import { getTiers } from '@/lib/db/tiers'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const downloads = await getDownloads()
    const download = downloads.find((item) => item.id === id)

    if (!download) {
      return NextResponse.json({ error: 'Download not found' }, { status: 404 })
    }

    const tiers = await getTiers()
    const requiredTier = tiers.find((tier) => tier.id === download.requiredTier)

    if (!requiredTier) {
      return NextResponse.json({ error: 'Download tier is not configured' }, { status: 500 })
    }

    if (download.requiredTier !== 'free') {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
      }

      const currentTier = await getUserTier(tiers)
      if (currentTier.tierRank < requiredTier.tierRank) {
        return NextResponse.json({ error: `Requires ${requiredTier.name} plan` }, { status: 403 })
      }
    }

    const signedUrl = await getDownloadSignedUrl(download.storagePath)
    return NextResponse.json({ signedUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create download URL'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
