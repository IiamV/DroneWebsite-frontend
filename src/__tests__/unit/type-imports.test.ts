/**
 * Type-import smoke tests.
 * These tests verify that key modules can be imported without TypeScript errors.
 * They act as a compile-time guard — if any import breaks, the test suite fails.
 */
import { describe, it, expect } from 'vitest'

// Mock data
import { mockProducts } from '@/mocks/products'
import { mockCourses } from '@/mocks/courses'
import { mockUser, mockSubscription } from '@/mocks/user'
import { mockTiers } from '@/mocks/tiers'

// Lib utilities
import { filterCompatibleProducts } from '@/lib/compatibility'

// Constants
import { PAGE_SIZE } from '@/constants/pagination'
import { ROUTES } from '@/constants/routes'
import { TIER_RANK } from '@/constants/tiers'

// Types
import type { Product, Course, User, Subscription, SubscriptionTier } from '@/types'

describe('type-import smoke tests', () => {
  it('mockProducts is a non-empty array of Product', () => {
    expect(Array.isArray(mockProducts)).toBe(true)
    expect(mockProducts.length).toBeGreaterThan(0)
    const p: Product = mockProducts[0]
    expect(typeof p.id).toBe('string')
    expect(typeof p.slug).toBe('string')
    expect(typeof p.category).toBe('string')
  })

  it('mockCourses is a non-empty array of Course', () => {
    expect(Array.isArray(mockCourses)).toBe(true)
    expect(mockCourses.length).toBeGreaterThan(0)
    const c: Course = mockCourses[0]
    expect(typeof c.id).toBe('string')
    expect(typeof c.slug).toBe('string')
    expect(Array.isArray(c.modules)).toBe(true)
  })

  it('mockUser has required User fields', () => {
    const u: User = mockUser
    expect(typeof u.id).toBe('string')
    expect(typeof u.email).toBe('string')
  })

  it('mockSubscription has required Subscription fields', () => {
    const s: Subscription = mockSubscription
    expect(typeof s.id).toBe('string')
    expect(typeof s.tierId).toBe('string')
    expect(s.status).toBe('active')
  })

  it('mockTiers is a non-empty array of SubscriptionTier', () => {
    expect(Array.isArray(mockTiers)).toBe(true)
    expect(mockTiers.length).toBeGreaterThan(0)
    const t: SubscriptionTier = mockTiers[0]
    expect(typeof t.id).toBe('string')
    expect(typeof t.price).toBe('number')
  })

  it('PAGE_SIZE is a positive number', () => {
    expect(typeof PAGE_SIZE).toBe('number')
    expect(PAGE_SIZE).toBeGreaterThan(0)
  })

  it('ROUTES has expected keys', () => {
    expect(typeof ROUTES.HOME).toBe('string')
    expect(typeof ROUTES.CATALOG).toBe('string')
    expect(typeof ROUTES.COURSES).toBe('string')
  })

  it('TIER_RANK maps tier IDs to numbers', () => {
    expect(typeof TIER_RANK).toBe('object')
    expect(typeof TIER_RANK['free']).toBe('number')
  })

  it('filterCompatibleProducts is callable and returns an array', () => {
    const result = filterCompatibleProducts([], mockProducts)
    expect(Array.isArray(result)).toBe(true)
  })

  it('all products have valid category values', () => {
    const validCategories = new Set([
      'frame', 'motor', 'esc', 'flight_controller',
      'propeller', 'battery', 'camera', 'complete_drone',
    ])
    for (const p of mockProducts) {
      expect(validCategories.has(p.category)).toBe(true)
    }
  })

  it('all courses have valid difficulty values', () => {
    const validDifficulties = new Set(['beginner', 'intermediate', 'advanced'])
    for (const c of mockCourses) {
      expect(validDifficulties.has(c.difficulty)).toBe(true)
    }
  })

  it('all courses have at least one module', () => {
    for (const c of mockCourses) {
      expect(c.modules.length).toBeGreaterThan(0)
    }
  })
})
