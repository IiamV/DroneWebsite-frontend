export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      course_modules: {
        Row: {
          content: string
          content_vi: string | null
          course_id: string
          id: string
          lesson_type: string
          order: number
          quiz: Json
          title: string
          title_vi: string | null
          video_url: string | null
        }
        Insert: {
          content?: string
          content_vi?: string | null
          course_id: string
          id?: string
          lesson_type?: string
          order?: number
          quiz?: Json
          title: string
          title_vi?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string
          content_vi?: string | null
          course_id?: string
          id?: string
          lesson_type?: string
          order?: number
          quiz?: Json
          title?: string
          title_vi?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          completed: boolean
          course_id: string
          id: string
          module_id: string
          progress_percent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          course_id: string
          id?: string
          module_id: string
          progress_percent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          course_id?: string
          id?: string
          module_id?: string
          progress_percent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          category_vi: string | null
          created_at: string
          description: string
          description_vi: string | null
          difficulty: string
          duration_minutes: number
          id: string
          required_tier: string
          slug: string
          thumbnail_url: string
          title: string
          title_vi: string | null
        }
        Insert: {
          category?: string
          category_vi?: string | null
          created_at?: string
          description?: string
          description_vi?: string | null
          difficulty?: string
          duration_minutes?: number
          id?: string
          required_tier?: string
          slug: string
          thumbnail_url?: string
          title: string
          title_vi?: string | null
        }
        Update: {
          category?: string
          category_vi?: string | null
          created_at?: string
          description?: string
          description_vi?: string | null
          difficulty?: string
          duration_minutes?: number
          id?: string
          required_tier?: string
          slug?: string
          thumbnail_url?: string
          title?: string
          title_vi?: string | null
        }
        Relationships: []
      }
      doc_pages: {
        Row: {
          content: string
          id: string
          order: number
          parent_slug: string | null
          slug: string[]
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          id?: string
          order?: number
          parent_slug?: string | null
          slug: string[]
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          id?: string
          order?: number
          parent_slug?: string | null
          slug?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      downloads: {
        Row: {
          changelog: string
          description: string
          file_size: string
          id: string
          platform: string
          release_date: string
          required_tier: string
          storage_path: string
          title: string
          version: string
        }
        Insert: {
          changelog?: string
          description?: string
          file_size?: string
          id?: string
          platform: string
          release_date: string
          required_tier?: string
          storage_path: string
          title: string
          version?: string
        }
        Update: {
          changelog?: string
          description?: string
          file_size?: string
          id?: string
          platform?: string
          release_date?: string
          required_tier?: string
          storage_path?: string
          title?: string
          version?: string
        }
        Relationships: []
      }
      drone_builds: {
        Row: {
          created_at: string
          description: string
          difficulty: string
          estimated_cost: number
          estimated_cost_vnd: number
          flight_time: string
          id: string
          model_url: string | null
          name: string
          product_ids: string[]
          slug: string
          steps: Json
          thumbnail_url: string
          use_case: string
          wires: Json
        }
        Insert: {
          created_at?: string
          description?: string
          difficulty: string
          estimated_cost?: number
          estimated_cost_vnd?: number
          flight_time?: string
          id?: string
          model_url?: string | null
          name: string
          product_ids?: string[]
          slug: string
          steps?: Json
          thumbnail_url?: string
          use_case?: string
          wires?: Json
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: string
          estimated_cost?: number
          estimated_cost_vnd?: number
          flight_time?: string
          id?: string
          model_url?: string | null
          name?: string
          product_ids?: string[]
          slug?: string
          steps?: Json
          thumbnail_url?: string
          use_case?: string
          wires?: Json
        }
        Relationships: []
      }
      payment_orders: {
        Row: {
          amount_usd: number
          amount_vnd: number
          checkout_url: string | null
          created_at: string
          currency: string
          id: string
          metadata: Json
          order_ref: string
          provider: string
          provider_transaction_id: string | null
          status: string
          tier_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_usd?: number
          amount_vnd?: number
          checkout_url?: string | null
          created_at?: string
          currency: string
          id?: string
          metadata?: Json
          order_ref: string
          provider: string
          provider_transaction_id?: string | null
          status?: string
          tier_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_usd?: number
          amount_vnd?: number
          checkout_url?: string | null
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          order_ref?: string
          provider?: string
          provider_transaction_id?: string | null
          status?: string
          tier_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_orders_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          affiliate_url: string | null
          brand: string
          category: string
          compatible_with: string[]
          created_at: string
          description: string
          features: string[]
          id: string
          image_urls: string[]
          model_url: string | null
          name: string
          pads: Json
          short_summary: string
          slug: string
          specs: Json
          tags: string[]
          thumbnail_url: string
        }
        Insert: {
          affiliate_url?: string | null
          brand?: string
          category: string
          compatible_with?: string[]
          created_at?: string
          description?: string
          features?: string[]
          id?: string
          image_urls?: string[]
          model_url?: string | null
          name: string
          pads?: Json
          short_summary?: string
          slug: string
          specs?: Json
          tags?: string[]
          thumbnail_url?: string
        }
        Update: {
          affiliate_url?: string | null
          brand?: string
          category?: string
          compatible_with?: string[]
          created_at?: string
          description?: string
          features?: string[]
          id?: string
          image_urls?: string[]
          model_url?: string | null
          name?: string
          pads?: Json
          short_summary?: string
          slug?: string
          specs?: Json
          tags?: string[]
          thumbnail_url?: string
        }
        Relationships: []
      }
      subscription_tiers: {
        Row: {
          badge_color: string
          badge_label: string
          billing_cycle: string
          course_access: string
          download_access: boolean
          features: string[]
          features_vi: string[]
          id: string
          name: string
          price: number
          price_vnd: number
          simulator_access: boolean
          tier_rank: number
        }
        Insert: {
          badge_color?: string
          badge_label?: string
          billing_cycle?: string
          course_access?: string
          download_access?: boolean
          features?: string[]
          features_vi?: string[]
          id: string
          name: string
          price?: number
          price_vnd?: number
          simulator_access?: boolean
          tier_rank?: number
        }
        Update: {
          badge_color?: string
          badge_label?: string
          billing_cycle?: string
          course_access?: string
          download_access?: boolean
          features?: string[]
          features_vi?: string[]
          id?: string
          name?: string
          price?: number
          price_vnd?: number
          simulator_access?: boolean
          tier_rank?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          end_date: string
          id: string
          start_date: string
          status: string
          tier_id: string
          user_id: string
          vnpay_transaction_id: string | null
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          start_date: string
          status?: string
          tier_id: string
          user_id: string
          vnpay_transaction_id?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          start_date?: string
          status?: string
          tier_id?: string
          user_id?: string
          vnpay_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_subscription_for_paid_order: {
        Args: {
          p_provider: string
          p_order_ref: string
          p_provider_transaction_id: string
          p_amount_vnd?: number | null
          p_amount_usd?: number | null
        }
        Returns: {
          created_at: string
          end_date: string
          id: string
          start_date: string
          status: string
          tier_id: string
          user_id: string
          vnpay_transaction_id: string | null
        }
      }
      can_read_course_modules: {
        Args: { target_course_id: string }
        Returns: boolean
      }
      refresh_user_subscription_status: {
        Args: { p_user_id?: string | null }
        Returns: {
          created_at: string
          end_date: string
          id: string
          start_date: string
          status: string
          tier_id: string
          user_id: string
          vnpay_transaction_id: string | null
        } | null
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
