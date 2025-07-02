import { supabase } from "./supabase"
import type { Database } from "./supabase"

export type Gym = Database["public"]["Tables"]["gyms"]["Row"]
export type EventType = Database["public"]["Tables"]["event_types"]["Row"]
export type Event = Database["public"]["Tables"]["events"]["Row"]
export type EventWithDetails = Database["public"]["Views"]["events_with_details"]["Row"]
export type GymStatistics = Database["public"]["Views"]["gym_statistics"]["Row"]

export async function getGyms() {
  const { data, error } = await supabase.from("gyms").select("*").order("name")

  if (error) {
    console.error("Error fetching gyms:", error)
    return []
  }

  return data
}

export async function getEventTypes() {
  const { data, error } = await supabase.from("event_types").select("*").order("name")

  if (error) {
    console.error("Error fetching event types:", error)
    return []
  }

  return data
}

export async function getEvents() {
  const { data, error } = await supabase.from("events_with_details").select("*").order("event_date")

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  return data
}

export async function getGymStatistics() {
  const { data, error } = await supabase.from("gym_statistics").select("*").order("gym_name")

  if (error) {
    console.error("Error fetching gym statistics:", error)
    return []
  }

  return data
}

export async function getEventsByGym(gymId: string) {
  const { data, error } = await supabase.from("events_with_details").select("*").eq("gym_id", gymId).order("event_date")

  if (error) {
    console.error("Error fetching events by gym:", error)
    return []
  }

  return data
}

export async function getEventsByType(eventTypeId: string) {
  const { data, error } = await supabase
    .from("events_with_details")
    .select("*")
    .eq("event_type_id", eventTypeId)
    .order("event_date")

  if (error) {
    console.error("Error fetching events by type:", error)
    return []
  }

  return data
}

export async function searchEvents(query: string) {
  const { data, error } = await supabase
    .from("events_with_details")
    .select("*")
    .or(`title.ilike.%${query}%,gym_name.ilike.%${query}%`)
    .order("event_date")

  if (error) {
    console.error("Error searching events:", error)
    return []
  }

  return data
}

export async function getGymEventTypeUrls(gymId: string) {
  const { data, error } = await supabase
    .from("gym_event_type_urls")
    .select(`
      id,
      url,
      event_types (
        id,
        name,
        display_name
      )
    `)
    .eq("gym_id", gymId)

  if (error) {
    console.error("Error fetching gym event type URLs:", error)
    return []
  }

  return data
}

// Helper function to format event data for display
export function formatEventData(event: EventWithDetails) {
  return {
    id: Number.parseInt(event.id),
    gymName: event.gym_name,
    gymAddress: event.gym_address || "",
    gymPhone: event.gym_phone || "",
    gymBookingPage: event.gym_booking_page || "",
    title: event.title,
    date: formatDate(event.event_date),
    time: event.event_time || "",
    price: event.price || "",
    day: getDayOfWeek(event.event_date),
    type: event.event_type as any,
    url: event.specific_url || "",
  }
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const month = date.toLocaleString("default", { month: "long" })
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

// Helper function to get day of week
function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString("default", { weekday: "long" })
}
