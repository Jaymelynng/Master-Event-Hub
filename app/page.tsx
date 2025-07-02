"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronUp, Building, AlertCircle, Database } from "lucide-react"
import { COLORS } from "@/constants/theme"
import type { ViewMode } from "@/types"
import { useDashboard } from "@/hooks/useDashboard"
import { QuickNavigation } from "@/components/QuickNavigation"
import { DashboardStats } from "@/components/DashboardStats"
import { ViewControls } from "@/components/ViewControls"
import { CalendarView } from "@/components/CalendarView"
import { CardView } from "@/components/CardView"
import { TableView } from "@/components/TableView"
import { DetailView } from "@/components/DetailView"
import { AdminView } from "@/components/AdminView"
import { supabase } from "@/lib/supabase"

export default function GymnasticsEventsDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar")
  const [showQuickNav, setShowQuickNav] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showBackToNav, setShowBackToNav] = useState(false)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const topRef = useRef<HTMLDivElement>(null)
  const gymRefs = useRef<Record<string, HTMLElement | null>>({})

  // Fetch events from Supabase
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        setError(null)

        // Check if Supabase is configured
        if (!supabase) {
          throw new Error("Supabase not configured. Please set your environment variables.")
        }

        const { data: eventsData, error: eventsError } = await supabase
          .from("events_with_details")
          .select("*")
          .order("event_date")

        if (eventsError) {
          throw new Error(`Database error: ${eventsError.message}`)
        }

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

  const dashboard = useDashboard(events)

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

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 300
      setShowBackToTop(scrolled)
      setShowBackToNav(scrolled && showQuickNav === false)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showQuickNav])

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const scrollToNavigation = () => {
    setShowQuickNav(true)
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const scrollToGym = (gymName: string) => {
    const element = gymRefs.current[gymName]
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div
        className="max-w-7xl mx-auto p-6 min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"
            style={{ borderTopColor: COLORS.primary }}
          ></div>
          <h2 className="text-xl font-bold mb-2" style={{ color: COLORS.text }}>
            Loading Events from Supabase Database
          </h2>
          <p style={{ color: COLORS.text }}>Connecting to your database...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div
        className="max-w-7xl mx-auto p-6 min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <div className="text-center max-w-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-4 text-red-600">Database Connection Failed</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-left">
            <p className="text-red-800 mb-4">
              <strong>Error:</strong> {error}
            </p>
            <div className="text-sm text-red-700">
              <p className="mb-2">
                <strong>Environment Variables Status:</strong>
              </p>
              <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ Not set"}</p>
              <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Not set"}</p>
              <div className="mt-4 p-3 bg-yellow-100 rounded">
                <p className="text-yellow-800 text-sm">
                  <strong>To fix this:</strong> Update your environment variables in the v0 project settings with your
                  actual Supabase URL and anon key.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen" style={{ backgroundColor: COLORS.background }}>
      <div ref={topRef} className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
          Gymnastics Events Dashboard
        </h1>
        <p style={{ color: COLORS.text }}>View, filter, and export gymnastics events across all locations</p>
      </div>

      {/* Database Connection Success Indicator */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">
            ✅ Connected to Supabase Database - {events.length} events loaded
          </span>
        </div>
      </div>

      {/* Quick Navigation */}
      {showQuickNav && (
        <QuickNavigation gyms={dashboard.allGyms} onGymClick={scrollToGym} onClose={() => setShowQuickNav(false)} />
      )}

      {/* Dashboard Stats */}
      <DashboardStats metrics={dashboard.metrics} selectedEventsCount={dashboard.selectedEvents.size} />

      {/* View Controls */}
      <ViewControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filteredEventsCount={dashboard.filteredAndSortedEvents.length}
        selectedEventsCount={dashboard.selectedEvents.size}
      />

      {/* Main Content */}
      <div>
        {viewMode === "calendar" && (
          <CalendarView
            events={events}
            allGyms={dashboard.allGyms}
            selectedGyms={dashboard.selectedGyms}
            selectedEventTypes={dashboard.selectedEventTypes}
            gymRefs={gymRefs}
          />
        )}

        {viewMode === "cards" && (
          <CardView
            events={dashboard.filteredAndSortedEvents}
            selectedEvents={dashboard.selectedEvents}
            onEventSelect={(eventId) => {
              const newSelection = new Set(dashboard.selectedEvents)
              if (newSelection.has(eventId)) {
                newSelection.delete(eventId)
              } else {
                newSelection.add(eventId)
              }
              dashboard.setSelectedEvents(newSelection)
            }}
          />
        )}

        {viewMode === "table" && (
          <TableView
            events={dashboard.filteredAndSortedEvents}
            selectedEvents={dashboard.selectedEvents}
            onEventSelect={(eventId) => {
              const newSelection = new Set(dashboard.selectedEvents)
              if (newSelection.has(eventId)) {
                newSelection.delete(eventId)
              } else {
                newSelection.add(eventId)
              }
              dashboard.setSelectedEvents(newSelection)
            }}
            sortBy={dashboard.sortBy}
            sortOrder={dashboard.sortOrder}
            onSort={(field, order) => {
              dashboard.setSortBy(field)
              dashboard.setSortOrder(order)
            }}
          />
        )}

        {viewMode === "admin" && <AdminView />}

        {viewMode === "detail" && <DetailView events={events} allGyms={dashboard.allGyms} />}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-40">
        {showBackToNav && (
          <button
            onClick={scrollToNavigation}
            className="text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:opacity-90"
            style={{ backgroundColor: COLORS.secondary }}
            title="Back to gym navigation"
          >
            <Building className="w-5 h-5" />
          </button>
        )}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:opacity-90"
            style={{ backgroundColor: COLORS.primary }}
            title="Back to top"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="mt-8 text-center text-sm" style={{ color: COLORS.text }}>
        <span className="text-green-600">🔗 Live Database:</span> {dashboard.metrics.totalEvents} events across{" "}
        {dashboard.metrics.totalGyms} gyms | Showing: {dashboard.filteredAndSortedEvents.length} events
        {dashboard.selectedEvents.size > 0 ? ` | Selected: ${dashboard.selectedEvents.size} events` : ""}
      </div>
    </div>
  )
}
