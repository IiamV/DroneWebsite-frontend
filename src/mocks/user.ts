import type { User, Subscription } from '@/types'

export const mockUser: User = {
  id: 'user-mock-001',
  email: 'pilot@example.com',
  name: 'Alex Nguyen',
  avatarUrl: '/images/avatars/default.jpg',
  passwordHash: '$2b$12$examplehashedpasswordnotreal',
  subscriptionId: 'sub-mock-001',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-03-01'),
}

export const mockSubscription: Subscription = {
  id: 'sub-mock-001',
  userId: 'user-mock-001',
  tierId: 'pro',
  status: 'active',
  startDate: new Date('2024-03-01'),
  endDate: new Date('2025-03-01'),
  vnpayTransactionId: 'VNP-TXN-20240301-001',
  createdAt: new Date('2024-03-01'),
}
