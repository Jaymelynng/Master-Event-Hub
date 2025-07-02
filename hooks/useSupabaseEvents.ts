"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"

export const useSupabaseEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching events from Supabase...")

        const { data: eventsData, error: eventsError } = await supabase
          .from("events_with_details")
          .select("*")
          .order("event_date")

        if (eventsError) {
          throw new Error(`Database error: ${eventsError.message}`)
        }

        console.log("Raw events data:", eventsData)

        if (!eventsData || eventsData.length === 0) {
          throw new Error("No events found in database")
        }

        // Transform database data to frontend format
        const transformedEvents = eventsData.map((event: any, index: number) => ({
          id: index + 1,
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

        console.log("Transformed events:", transformedEvents)
        setEvents(transformedEvents)
      } catch (err: any) {
        console.error("Failed to fetch events:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return { events, loading, error }
}

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
