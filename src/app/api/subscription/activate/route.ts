import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Direct subscription activation is disabled. Use a verified payment callback.' },
    { status: 410 }
  )
}
