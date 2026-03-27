'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { User } from '@/types'
import { mockUser } from '@/mocks/user'

const AUTH_KEY = 'drone_sim_authed'

interface AuthContextValue {
  user: User | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Restore auth from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(AUTH_KEY) === '1') {
      setUser(mockUser)
    }
  }, [])

  const login = useCallback(() => {
    localStorage.setItem(AUTH_KEY, '1')
    setUser(mockUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
