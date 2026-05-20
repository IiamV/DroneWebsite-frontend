import { NextResponse } from 'next/server'
import { createSubscription } from '@/lib/db/subscriptions'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { tierId, vnpayTransactionId } = body as { tierId: string; vnpayTransactionId?: string }

    if (!tierId) {
      return NextResponse.json({ error: 'tierId is required' }, { status: 400 })
    }

    const subscription = await createSubscription(tierId, vnpayTransactionId ?? null)
    return NextResponse.json({ subscription }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
