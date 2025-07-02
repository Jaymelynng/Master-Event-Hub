"use client"

import { useState, useEffect } from "react"
import { supabase, isSupabaseAvailable } from "@/lib/supabase-client"
import { SAMPLE_EVENTS } from "@/constants/events"

export const useSupabaseData = () => {
  const [events, setEvents] = useState(SAMPLE_EVENTS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<"sample" | "database">("sample")

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      // Check if Supabase is available
      if (!isSupabaseAvailable()) {
        setError("Supabase client not available")
        setDataSource("sample")
        setLoading(false)
        return
      }

      try {
        // Test connection with a simple query
        const { data: testData, error: testError } = await supabase.from("gyms").select("count").limit(1)

        if (testError) {
          throw new Error(`Database connection failed: ${testError.message}`)
        }

        // Fetch events from the view
        const { data: eventsData, error: eventsError } = await supabase
          .from("events_with_details")
          .select("*")
          .order("event_date")

        if (eventsError) {
          throw new Error(`Failed to fetch events: ${eventsError.message}`)
        }

        // Transform the data to match our frontend format
        const transformedEvents = eventsData.map((event: any, index: number) => ({
          id: index + 1, // Use index as ID since we need numbers
          gymName: event.gym_name,
          gymAddress: event.gym_address || "",
          gymPhone: event.gym_phone || "",
          gymBookingPage: event.gym_booking_page || "",
          title: event.title,
          date: formatDate(event.event_date),
          time: event.event_time || "",
          price: event.price || "",
          day: event.day_of_week || getDayOfWeek(event.event_date),
          type: event.event_type,
          url: event.specific_url || "",
        }))

        setEvents(transformedEvents)
        setDataSource("database")
        setError(null)
      } catch (err: any) {
        console.error("Supabase fetch error:", err)
        setError(err.message)
        setDataSource("sample")
        // Keep sample data as fallback
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { events, loading, error, dataSource }
}

// Helper functions
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const month = date.toLocaleString("default", { month: "long" })
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString("default", { weekday: "long" })
}
