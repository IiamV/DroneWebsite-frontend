// Middleware only runs in server/edge environments (local dev, Vercel, etc.)
// It is NOT used during static export (GitHub Pages) — locale routing is
// handled by the [locale] segment and client-side navigation instead.

import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and _next
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
}
