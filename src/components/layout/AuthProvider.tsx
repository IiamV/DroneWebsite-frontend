'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as AppUser } from '@/types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface AuthContextValue {
  user: AppUser | null
  supabaseUser: SupabaseUser | null
  emailConfirmed: boolean
  login: (email: string, password: string) => Promise<{ error: string | null }>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

function supabaseUserToAppUser(u: SupabaseUser): AppUser {
  return {
    id: u.id,
    email: u.email ?? '',
    name: (u.user_metadata?.name as string) ?? u.email ?? 'User',
    avatarUrl: (u.user_metadata?.avatar_url as string) ?? null,
    passwordHash: '',
    subscriptionId: null,
    createdAt: new Date(u.created_at),
    updatedAt: new Date(u.updated_at ?? u.created_at),
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [supabase])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [supabase])

  const user = supabaseUser ? supabaseUserToAppUser(supabaseUser) : null
  const emailConfirmed = !!(supabaseUser?.email_confirmed_at)

  return (
    <AuthContext.Provider value={{ user, supabaseUser, emailConfirmed, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
