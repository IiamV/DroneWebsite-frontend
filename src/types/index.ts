export interface User {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  passwordHash: string
  subscriptionId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  id: string
  userId: string
  tierId: string
  status: 'active' | 'expired' | 'cancelled' | 'pending'
  startDate: Date
  endDate: Date
  vnpayTransactionId: string | null
  createdAt: Date
}

export interface SubscriptionTier {
  id: string
  name: string
  price: number
  billingCycle: 'monthly' | 'yearly'
  features: string[]
  downloadAccess: boolean
  courseAccess: 'none' | 'basic' | 'full'
  simulatorAccess: boolean
  badgeColor: string
  badgeLabel: string
  tierRank: number
}

export interface CourseModule {
  id: string
  courseId: string
  title: string
  videoUrl: string | null
  content: string
  order: number
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  thumbnailUrl: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  durationMinutes: number
  requiredTier: string
  modules: CourseModule[]
  createdAt: Date
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: 'frame' | 'motor' | 'esc' | 'flight_controller' | 'propeller' | 'battery' | 'camera' | 'complete_drone'
  thumbnailUrl: string
  imageUrls: string[]
  shortSummary: string
  description: string
  features: string[]
  specs: Record<string, string>
  compatibleWith: string[]
  tags: string[]
  affiliateUrl: string | null
  createdAt: Date
}

export interface Download {
  id: string
  title: string
  description: string
  version: string
  platform: 'windows' | 'mac' | 'linux' | 'all'
  fileSize: string
  storagePath: string
  requiredTier: string
  releaseDate: Date
  changelog: string
}

export interface DocPage {
  id: string
  slug: string[]
  title: string
  content: string
  order: number
  parentSlug: string | null
  updatedAt: Date
}

export interface AccessResult {
  allowed: boolean
  reason: string
}
