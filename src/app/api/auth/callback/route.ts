import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Supabase Auth callback — handles email confirmation and OAuth redirects.
 *
 * Supabase redirects here with a `code` query param after the user clicks
 * the confirmation link in their email. We exchange the code for a session,
 * then redirect to the confirmation success page.
 *
 * In Supabase Dashboard → Authentication → URL Configuration, set:
 *   Redirect URL: https://yourdomain.com/api/auth/callback
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  // Determine locale from the referrer or default to 'en'
  const locale = 'en'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirect to the confirmation success page
      return NextResponse.redirect(`${origin}/${locale}/auth/confirm`)
    }

    console.error('[Auth callback] Code exchange failed:', error.message)
  }

  // Fallback — redirect to login with error
  return NextResponse.redirect(`${origin}/${locale}/auth/login?error=confirmation_failed`)
}
