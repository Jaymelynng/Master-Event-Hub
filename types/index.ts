export interface Event {
  id: number
  gymName: string
  gymAddress: string
  gymPhone: string
  gymBookingPage: string
  title: string
  date: string
  time: string
  price: string
  day: string
  type: EventType
  url: string
}

export type EventType = "CLINIC" | "KIDS NIGHT OUT" | "OPEN GYM" | "Summer Camp"

export type ViewMode = "cards" | "table" | "calendar" | "detail" | "admin"

export type SortField = "date" | "gym" | "type" | "title"

export interface DashboardMetrics {
  totalEvents: number
  totalGyms: number
  filteredEvents: number
  mostPopularType: string
  averageEventsPerGym: string
}

export interface CopiedStates {
  [key: string]: boolean
}
