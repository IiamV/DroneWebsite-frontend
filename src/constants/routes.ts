export const ROUTES = {
  HOME: '/',
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  SUBSCRIPTION: '/subscription',
  SUBSCRIPTION_CHECKOUT: '/subscription/checkout',
  PROFILE: '/profile',
  COURSES: '/courses',
  CATALOG: '/catalog',
  DOWNLOADS: '/downloads',
  DOCS: '/docs',
  PRICING: '/subscription',
} as const

export type Route = (typeof ROUTES)[keyof typeof ROUTES]

// Returns a route prefixed with the active locale, e.g. /en/catalog
export function localePath(locale: string, route: string) {
  return `/${locale}${route}`
}
