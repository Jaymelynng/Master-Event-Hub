"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronUp, Building, AlertCircle } from "lucide-react"
import { COLORS } from "@/constants/theme"
import type { ViewMode } from "@/types"
import { useDashboard } from "@/hooks/useDashboard"
import { MonthYearSelector } from "@/components/MonthYearSelector"
import { QuickNavigation } from "@/components/QuickNavigation"
import { DashboardStats } from "@/components/DashboardStats"
import { ViewControls } from "@/components/ViewControls"
import { CalendarView } from "@/components/CalendarView"
import { CardView } from "@/components/CardView"
import { TableView } from "@/components/TableView"
import { DetailView } from "@/components/DetailView"
import { AdminView } from "@/components/AdminView"
import { ConnectionDiagnostic } from "@/components/ConnectionDiagnostic"
import { supabase } from "@/lib/supabase"
import { getDayOfWeek } from "@/utils/helpers"
import { getMonthYearFromDate, formatMonthYear, isDateInMonth } from "@/utils/dateUtils"

export default function GymnasticsEventsDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar")
  const [showQuickNav, setShowQuickNav] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showBackToNav, setShowBackToNav] = useState(false)
  const [allEvents, setAllEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDiagnostic, setShowDiagnostic] = useState(false)

  // Default to June 2025 (where all gyms have events)
  const [selectedMonth, setSelectedMonth] = useState(5) // June = 5 (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2025)

  const topRef = useRef<HTMLDivElement>(null)
  const gymRefs = useRef<Record<string, HTMLElement | null>>({})

  // Filter events by selected month/year
  const filteredEventsByMonth = allEvents.filter((event) => {
    if (!event.date) return false
    return isDateInMonth(event.date, selectedMonth, selectedYear)
  })

  // DEBUG: Show sample event dates to check filtering
  if (allEvents.length > 0 && filteredEventsByMonth.length === 0) {
    console.log("⚠️ DEBUG - No events match current filter!")
    console.log("📅 DEBUG - Sample event dates:", allEvents.slice(0, 3).map((event: any) => event.date))
    console.log("🎯 DEBUG - Looking for:", formatMonthYear(selectedMonth, selectedYear))
  }

  // Get available months with event counts
  const availableMonths = (() => {
    const monthCounts = new Map<string, { month: number; year: number; count: number }>()

    allEvents.forEach((event) => {
      if (event.date) {
        const { month, year } = getMonthYearFromDate(event.date)
        const key = `${month}-${year}`

        if (monthCounts.has(key)) {
          monthCounts.get(key)!.count++
        } else {
          monthCounts.set(key, { month, year, count: 1 })
        }
      }
    })

    return Array.from(monthCounts.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return a.month - b.month
    })
  })()

  // Fetch events from Supabase
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        setError(null)

        console.log("🔄 Starting Supabase connection...")

        // Check if environment variables are set
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          throw new Error(`Missing environment variables: URL=${!!supabaseUrl}, KEY=${!!supabaseKey}`)
        }

        console.log("✅ Environment variables found")

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

        console.log(`✅ Loaded ${eventsData.length} events from database`)

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

        setAllEvents(transformedEvents)
        console.log("✅ Events transformed and loaded successfully")
        console.log("📊 DEBUG - Sample transformed event:", transformedEvents[0])
        console.log("📊 DEBUG - Total events loaded:", transformedEvents.length)
      } catch (err: any) {
        console.error("❌ Failed to fetch events:", err)
        setError(err.message)
        setShowDiagnostic(true) // Show diagnostic on error
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const dashboard = useDashboard(allEvents)

  // DEBUG: Log what's happening with data
  console.log("📊 DEBUG - All events count:", allEvents.length)
  console.log("📊 DEBUG - Filtered events count:", filteredEventsByMonth.length)
  console.log("📊 DEBUG - Dashboard metrics:", dashboard.metrics)
  console.log("📊 DEBUG - Selected month/year:", selectedMonth, selectedYear)

  // Helper functions - using consistent date formatting to prevent hydration issues
  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    const month = monthNames[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
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

  // Show error state with diagnostic
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 min-h-screen" style={{ backgroundColor: COLORS.background }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-red-600">Database Connection Failed</h2>
            <p className="text-red-800 mb-6">
              <strong>Error:</strong> {error}
            </p>
          </div>

          {/* Connection Diagnostic */}
          <ConnectionDiagnostic />

          {/* Environment Variables Help */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-yellow-800 mb-4">🔧 How to Fix This</h3>
            <div className="space-y-4 text-yellow-800">
              <div>
                <h4 className="font-semibold mb-2">Option 1: Set Environment Variables in v0</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Go to your v0 project settings</li>
                  <li>Add these environment variables:</li>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>
                      <code>NEXT_PUBLIC_SUPABASE_URL</code>: Your Supabase project URL
                    </li>
                    <li>
                      <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>: Your Supabase anon key
                    </li>
                  </ul>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Option 2: Create .env.local File</h4>
                <pre className="bg-yellow-100 p-3 rounded text-xs overflow-x-auto">
                  {`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Current Status:</h4>
                <p className="text-sm">
                  URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ Not set"}
                  <br />
                  Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Not set"}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen" style={{ backgroundColor: COLORS.background }}>
      <div ref={topRef} className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
          Gymnastics Events Dashboard - {formatMonthYear(selectedMonth, selectedYear)}
        </h1>
        <p style={{ color: COLORS.text }}>View, filter, and export gymnastics events across all locations</p>
      </div>

      {/* Show diagnostic option */}
      {!showDiagnostic && (
        <div className="mb-6">
          <button
            onClick={() => setShowDiagnostic(!showDiagnostic)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            🔍 Show Connection Diagnostic
          </button>
        </div>
      )}

      {/* Connection Diagnostic */}
      {showDiagnostic && <ConnectionDiagnostic />}

      {/* Month/Year Selector */}
      <MonthYearSelector
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        availableMonths={availableMonths}
      />

      {/* Quick Navigation */}
      {showQuickNav && dashboard.allGyms.length > 0 && (
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
            events={filteredEventsByMonth}
            allGyms={dashboard.allGyms}
            selectedGyms={dashboard.selectedGyms}
            selectedEventTypes={dashboard.selectedEventTypes}
            gymRefs={gymRefs}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
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

        {viewMode === "detail" && <DetailView events={filteredEventsByMonth} allGyms={dashboard.allGyms} />}
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
        <span className="text-green-600">🔗 Live Database:</span> {allEvents.length} total events across{" "}
        {dashboard.allGyms.length} gyms | {formatMonthYear(selectedMonth, selectedYear)}: {filteredEventsByMonth.length}{" "}
        events | Showing: {dashboard.filteredAndSortedEvents.length} events
        {dashboard.selectedEvents.size > 0 && ` | Selected: ${dashboard.selectedEvents.size} events`}
      </div>
    </div>
  )
}
