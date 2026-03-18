export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          password_hash: string
          subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          password_hash: string
          subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          password_hash?: string
          subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier_id: string
          status: 'active' | 'expired' | 'cancelled' | 'pending'
          start_date: string
          end_date: string
          vnpay_transaction_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier_id: string
          status: 'active' | 'expired' | 'cancelled' | 'pending'
          start_date: string
          end_date: string
          vnpay_transaction_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier_id?: string
          status?: 'active' | 'expired' | 'cancelled' | 'pending'
          start_date?: string
          end_date?: string
          vnpay_transaction_id?: string | null
          created_at?: string
        }
      }
      subscription_tiers: {
        Row: {
          id: string
          name: string
          price: number
          billing_cycle: 'monthly' | 'yearly'
          features: string[]
          download_access: boolean
          course_access: 'none' | 'basic' | 'full'
          simulator_access: boolean
          badge_color: string
          badge_label: string
          tier_rank: number
        }
        Insert: {
          id?: string
          name: string
          price: number
          billing_cycle: 'monthly' | 'yearly'
          features: string[]
          download_access: boolean
          course_access: 'none' | 'basic' | 'full'
          simulator_access: boolean
          badge_color: string
          badge_label: string
          tier_rank: number
        }
        Update: {
          id?: string
          name?: string
          price?: number
          billing_cycle?: 'monthly' | 'yearly'
          features?: string[]
          download_access?: boolean
          course_access?: 'none' | 'basic' | 'full'
          simulator_access?: boolean
          badge_color?: string
          badge_label?: string
          tier_rank?: number
        }
      }
      courses: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          thumbnail_url: string
          category: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          duration_minutes: number
          required_tier: string
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description: string
          thumbnail_url: string
          category: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          duration_minutes: number
          required_tier: string
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          thumbnail_url?: string
          category?: string
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          duration_minutes?: number
          required_tier?: string
          created_at?: string
        }
      }
      course_modules: {
        Row: {
          id: string
          course_id: string
          title: string
          video_url: string | null
          content: string
          order: number
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          video_url?: string | null
          content: string
          order: number
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          video_url?: string | null
          content?: string
          order?: number
        }
      }
      course_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          module_id: string
          completed: boolean
          progress_percent: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          module_id: string
          completed: boolean
          progress_percent: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          module_id?: string
          completed?: boolean
          progress_percent?: number
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          slug: string
          name: string
          brand: string
          category: 'frame' | 'motor' | 'esc' | 'flight_controller' | 'propeller' | 'battery' | 'camera' | 'complete_drone'
          thumbnail_url: string
          image_urls: string[]
          short_summary: string
          description: string
          features: string[]
          specs: Json
          compatible_with: string[]
          tags: string[]
          affiliate_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          brand: string
          category: 'frame' | 'motor' | 'esc' | 'flight_controller' | 'propeller' | 'battery' | 'camera' | 'complete_drone'
          thumbnail_url: string
          image_urls: string[]
          short_summary: string
          description: string
          features: string[]
          specs: Json
          compatible_with: string[]
          tags: string[]
          affiliate_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          brand?: string
          category?: 'frame' | 'motor' | 'esc' | 'flight_controller' | 'propeller' | 'battery' | 'camera' | 'complete_drone'
          thumbnail_url?: string
          image_urls?: string[]
          short_summary?: string
          description?: string
          features?: string[]
          specs?: Json
          compatible_with?: string[]
          tags?: string[]
          affiliate_url?: string | null
          created_at?: string
        }
      }
      downloads: {
        Row: {
          id: string
          title: string
          description: string
          version: string
          platform: 'windows' | 'mac' | 'linux' | 'all'
          file_size: string
          storage_path: string
          required_tier: string
          release_date: string
          changelog: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          version: string
          platform: 'windows' | 'mac' | 'linux' | 'all'
          file_size: string
          storage_path: string
          required_tier: string
          release_date: string
          changelog: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          version?: string
          platform?: 'windows' | 'mac' | 'linux' | 'all'
          file_size?: string
          storage_path?: string
          required_tier?: string
          release_date?: string
          changelog?: string
        }
      }
      doc_pages: {
        Row: {
          id: string
          slug: string[]
          title: string
          content: string
          order: number
          parent_slug: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string[]
          title: string
          content: string
          order: number
          parent_slug?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string[]
          title?: string
          content?: string
          order?: number
          parent_slug?: string | null
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
