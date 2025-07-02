import { createClient } from "@supabase/supabase-js"

// Get environment variables with proper validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug logging (remove in production)
console.log("🔍 Supabase Connection Debug:")
console.log("URL exists:", !!supabaseUrl)
console.log("URL value:", supabaseUrl)
console.log("Key exists:", !!supabaseAnonKey)
console.log("Key preview:", supabaseAnonKey?.substring(0, 20) + "...")

// Validate environment variables
if (!supabaseUrl) {
  throw new Error("❌ NEXT_PUBLIC_SUPABASE_URL is required but not set")
}

if (!supabaseAnonKey) {
  throw new Error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is required but not set")
}

// Validate URL format
if (!supabaseUrl.startsWith("https://") || !supabaseUrl.includes(".supabase.co")) {
  throw new Error(`❌ Invalid Supabase URL format: "${supabaseUrl}"`)
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl.trim(), supabaseAnonKey.trim())

// Test connection function
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("gyms").select("count").limit(1)

    if (error) {
      throw new Error(`Database connection failed: ${error.message}`)
    }

    console.log("✅ Supabase connection successful")
    return { success: true, data }
  } catch (error) {
    console.error("❌ Supabase connection failed:", error)
    return { success: false, error: error.message }
  }
}

// Database types (keeping your existing types)
export type Database = {
  public: {
    Tables: {
      gyms: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          booking_page_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          phone?: string | null
          booking_page_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          booking_page_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      event_types: {
        Row: {
          id: string
          name: string
          display_name: string
          color: string
          is_required: boolean
          min_required: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          color: string
          is_required?: boolean
          min_required?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          color?: string
          is_required?: boolean
          min_required?: number
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          gym_id: string
          event_type_id: string
          title: string
          event_date: string
          event_time: string | null
          price: string | null
          day_of_week: string | null
          specific_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gym_id: string
          event_type_id: string
          title: string
          event_date: string
          event_time?: string | null
          price?: string | null
          day_of_week?: string | null
          specific_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gym_id?: string
          event_type_id?: string
          title?: string
          event_date?: string
          event_time?: string | null
          price?: string | null
          day_of_week?: string | null
          specific_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      events_with_details: {
        Row: {
          id: string
          title: string
          event_date: string
          event_time: string | null
          price: string | null
          day_of_week: string | null
          specific_url: string | null
          created_at: string
          updated_at: string
          gym_name: string
          gym_address: string | null
          gym_phone: string | null
          gym_booking_page: string | null
          event_type: string
          event_type_display: string
          event_type_color: string
          is_required: boolean
          min_required: number
        }
      }
      gym_statistics: {
        Row: {
          gym_id: string
          gym_name: string
          address: string | null
          phone: string | null
          booking_page_url: string | null
          total_events: number
          kno_count: number
          clinic_count: number
          open_gym_count: number
          summer_camp_count: number
          monthly_required_events: number
          meets_requirements: boolean
        }
      }
    }
  }
}
