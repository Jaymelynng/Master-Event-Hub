import { createClient } from "@supabase/supabase-js"

// Get environment variables with debugging
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("Supabase URL:", supabaseUrl)
console.log("Supabase Key exists:", !!supabaseAnonKey)

// Validate and clean the URL
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`Missing environment variables: URL=${!!supabaseUrl}, KEY=${!!supabaseAnonKey}`)
}

// Clean the URL (remove any whitespace)
const cleanUrl = supabaseUrl.trim()

// Validate URL format
if (!cleanUrl.startsWith("https://") || !cleanUrl.includes(".supabase.co")) {
  throw new Error(`Invalid Supabase URL format: "${cleanUrl}"`)
}

export const supabase = createClient(cleanUrl, supabaseAnonKey.trim())

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
