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
