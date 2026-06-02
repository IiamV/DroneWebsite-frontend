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
  priceVnd: number
  billingCycle: 'monthly' | 'yearly'
  features: string[]
  featuresVi: string[]
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
  lessonType: 'lesson' | 'quiz' | 'project'
  quiz: CourseQuizQuestion[]
  order: number
}

export interface CourseQuizQuestion {
  id: string
  question: string
  options: string[]
  answerIndex: number
  explanation: string
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

export interface CompletedCourse {
  id: string
  slug: string
  title: string
  description: string
  category: string
  difficulty: Course['difficulty']
  completedModules: number
  progressPercent: number
  completedAt: Date
}

export type PadType = 'power' | 'signal' | 'phase' | 'data'

export interface Pad {
  id: string
  label: string
  type: PadType
  color: string
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
  modelUrl: string | null
  /** Electrical connection pads (GND, +5V, DSHOT, Phase A/B/C, etc.) */
  pads: Pad[]
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

// ── Drone Builds ───────────────────────────────────────────────────────────

export type BuildDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface BuildStep {
  order: number
  title: string
  description: string
  /** Optional product IDs relevant to this step */
  productIds: string[]
  /** Optional wiring note for this step */
  wiringNote?: string
}

export interface BuildWire {
  fromComponent: string   // e.g. "ESC"
  fromPad: string         // e.g. "S1"
  toComponent: string     // e.g. "Flight Controller"
  toPad: string           // e.g. "M1"
  label: string           // e.g. "Motor 1 signal (DSHOT)"
  color: string           // hex
}

export interface DroneBuild {
  id: string
  slug: string
  name: string
  description: string
  thumbnailUrl: string
  difficulty: BuildDifficulty
  estimatedCost: number        // USD
  estimatedCostVnd: number
  flightTime: string           // e.g. "8–10 min"
  useCase: string              // e.g. "5-inch freestyle"
  /** Ordered list of product IDs in this build */
  productIds: string[]
  steps: BuildStep[]
  wires: BuildWire[]
  /** Optional GLB model URL for the assembled drone */
  modelUrl: string | null
  /** Performance statistics */
  stats?: {
    topSpeedKmh?: number          // estimated top speed in km/h
    totalWeightG?: number         // total all-up weight in grams
    maxPayloadG?: number          // max additional payload in grams
    thrustToWeightRatio?: number  // e.g. 4.2 (×g)
    motorCount?: number           // number of motors
    propSizeInch?: number         // propeller diameter in inches
    batteryCell?: number          // e.g. 4 for 4S, 6 for 6S
    maxRangeKm?: number           // estimated max range in km
    hoverThrustPct?: number       // throttle % needed to hover (efficiency indicator)
  }
  createdAt: Date
}
