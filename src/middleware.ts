import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Run next-intl middleware on all paths EXCEPT:
    // - /api/* routes (payment, subscription, etc.)
    // - Next.js internals (_next, _vercel)
    // - Static files (anything with a file extension)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
