"use client"

import { useState, type MutableRefObject } from "react"
import { ExternalLink, Copy, CheckCircle } from "lucide-react"
import type { Event, EventType } from "@/types"
import { EVENT_TYPE_COLORS, COLORS } from "@/constants/theme"
import { getDaysInMonth, getCurrentMonthInfo } from "@/utils/eventUtils"
import { copyToClipboard } from "@/utils/copyUtils"
import { getGymEventTypeUrl } from "@/constants/gymUrls"

interface CalendarViewProps {
  events: Event[]
  allGyms: string[]
  selectedGyms: Set<string>
  selectedEventTypes: Set<string>
  gymRefs: MutableRefObject<Record<string, HTMLElement | null>>
}

export const CalendarView = ({ events, allGyms, selectedGyms, selectedEventTypes, gymRefs }: CalendarViewProps) => {
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null)
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})
  const [calendarPage, setCalendarPage] = useState<1 | 2>(1)
  
  // Get current month info
  const currentMonthInfo = getCurrentMonthInfo()

  const handleCopy = async (text: string, id: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopiedStates((prev) => ({ ...prev, [id]: true }))
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [id]: false }))
      }, 2000)
    }
  }

  const renderCalendarCell = (gym: string, day: string) => {
    const dayEvents = events.filter(
      (event) =>
        event.gymName === gym &&
        event.date === day &&
        (selectedEventTypes.has("all") || selectedEventTypes.has(event.type)),
    )

    if (dayEvents.length === 0) return null

    return (
      <div className="flex flex-col gap-1">
        {dayEvents.map((event, i) => (
          <div
            key={i}
            className="relative"
            onMouseEnter={() => setHoveredEvent(event.id)}
            onMouseLeave={() => setHoveredEvent(null)}
          >
            <div
              className="p-1 text-xs rounded cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: EVENT_TYPE_COLORS[event.type as EventType] || "#f3f4f6",
                transform: hoveredEvent === event.id ? "scale(1.1)" : "scale(1)",
                boxShadow: hoveredEvent === event.id ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)" : "none",
                zIndex: hoveredEvent === event.id ? 20 : 1,
              }}
            >
              <div className="font-semibold">{event.type || "No Type"}</div>
              <div>{event.time ? event.time.split(" - ")[0] : "No Time"}</div>
            </div>

            {/* Hover card */}
            {hoveredEvent === event.id && (
              <div
                className="absolute bg-white rounded-lg shadow-xl p-3 border z-50"
                style={{
                  top: "100%",
                  left: "0",
                  marginTop: "4px",
                  borderColor: COLORS.border,
                  width: "250px",
                }}
              >
                <h4 className="font-bold text-sm mb-1" style={{ color: COLORS.text }}>
                  {event.title}
                </h4>
                <p className="text-xs mb-2" style={{ color: COLORS.text }}>
                  {event.date} {event.day ? `(${event.day})` : ""}
                  <br />
                  {event.time}
                  <br />
                  {event.price}
                </p>
                <div className="flex gap-2">
                  {event.url && (
                    <>
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 text-white text-xs rounded hover:opacity-90"
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </a>
                      <button
                        onClick={() => handleCopy(event.url, `cal-${event.id}`)}
                        className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:opacity-90"
                        style={{
                          backgroundColor: COLORS.border,
                          color: COLORS.text,
                        }}
                      >
                        {copiedStates[`cal-${event.id}`] ? (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        Copy URL
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Event type legend */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-bold mb-2" style={{ color: COLORS.text }}>
          Event Types:
        </h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(EVENT_TYPE_COLORS).map(([type, color], i) => (
            <div key={i} className="flex items-center">
              <div className="w-4 h-4 mr-1" style={{ backgroundColor: color }}></div>
              <span className="text-sm" style={{ color: COLORS.text }}>
                {type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Event Statistics */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-bold mb-2" style={{ color: COLORS.text }}>
          Event Statistics by Gym: (Total Events: {events.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border" style={{ color: COLORS.text }}>
                  Gym
                </th>
                <th className="p-2 border" style={{ color: COLORS.text }}>
                  KNO
                </th>
                <th className="p-2 border" style={{ color: COLORS.text }}>
                  Clinic
                </th>
                <th className="p-2 border" style={{ color: COLORS.text }}>
                  Open Gym
                </th>
                <th className="p-2 border" style={{ color: COLORS.text }}>
                  Total Monthly Events
                </th>
                <th className="p-2 border" style={{ color: COLORS.text }}>
                  Missing
                </th>
                <th className="p-2 border" style={{ color: COLORS.text }}>
                  Summer Camp
                </th>
                <th className="p-2 border" style={{ color: COLORS.text }}>
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              {allGyms.map((gym, i) => {
                const gymEvents = events.filter((event) => event.gymName === gym)

                // Get counts for each required event type
                const knoCount = gymEvents.filter((event) => event.type === "KIDS NIGHT OUT").length
                const clinicCount = gymEvents.filter((event) => event.type === "CLINIC").length
                const openGymCount = gymEvents.filter((event) => event.type === "OPEN GYM").length
                const summerCampCount = gymEvents.filter((event) => event.type === "Summer Camp").length

                // Calculate totals
                const totalMonthlyEvents = knoCount + clinicCount + openGymCount
                const totalAllEvents = gymEvents.length

                // Check minimum requirements (only for required events)
                const missingRequirements = []
                if (knoCount < 2) {
                  missingRequirements.push("KNO")
                }
                if (clinicCount < 1) {
                  missingRequirements.push("Clinic")
                }
                if (openGymCount < 1) {
                  missingRequirements.push("Open Gym")
                }

                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-2 border font-medium" style={{ color: COLORS.text }}>
                      {gym}
                    </td>
                    <td className="p-2 border text-center" style={{ color: COLORS.text }}>
                      <a
                        href={getGymEventTypeUrl(gym, "KIDS NIGHT OUT")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline font-medium transition-colors ${
                          knoCount > 0 ? "text-blue-600 hover:text-blue-800" : "text-gray-400 hover:text-gray-600"
                        }`}
                        title={`View ${gym} Kids Night Out events`}
                      >
                        {knoCount}
                      </a>
                    </td>
                    <td className="p-2 border text-center" style={{ color: COLORS.text }}>
                      <a
                        href={getGymEventTypeUrl(gym, "CLINIC")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline font-medium transition-colors ${
                          clinicCount > 0 ? "text-blue-600 hover:text-blue-800" : "text-gray-400 hover:text-gray-600"
                        }`}
                        title={`View ${gym} Clinic events`}
                      >
                        {clinicCount}
                      </a>
                    </td>
                    <td className="p-2 border text-center" style={{ color: COLORS.text }}>
                      <a
                        href={getGymEventTypeUrl(gym, "OPEN GYM")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline font-medium transition-colors ${
                          openGymCount > 0 ? "text-blue-600 hover:text-blue-800" : "text-gray-400 hover:text-gray-600"
                        }`}
                        title={`View ${gym} Open Gym events`}
                      >
                        {openGymCount}
                      </a>
                    </td>
                    <td className="p-2 border text-center font-bold" style={{ color: COLORS.text }}>
                      {totalMonthlyEvents}
                    </td>
                    <td className="p-2 border text-xs" style={{ color: COLORS.text }}>
                      {missingRequirements.length > 0 ? (
                        <span className="text-red-600 font-medium">{missingRequirements.join(", ")}</span>
                      ) : (
                        <span className="text-green-600 font-medium">✓ Complete</span>
                      )}
                    </td>
                    <td className="p-2 border text-center" style={{ color: COLORS.text }}>
                      <a
                        href={getGymEventTypeUrl(gym, "Summer Camp")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline font-medium transition-colors ${
                          summerCampCount > 0
                            ? "text-blue-600 hover:text-blue-800"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                        title={`View ${gym} Summer Camp events`}
                      >
                        {summerCampCount}
                      </a>
                    </td>
                    <td className="p-2 border text-center font-bold" style={{ color: COLORS.text }}>
                      {totalAllEvents}
                    </td>
                  </tr>
                )
              })}

              {/* Total Row */}
              <tr className="bg-gray-100 font-bold">
                <td className="p-2 border" style={{ color: COLORS.text }}>
                  TOTAL
                </td>
                <td className="p-2 border text-center" style={{ color: COLORS.text }}>
                  {events.filter((event) => event.type === "KIDS NIGHT OUT").length}
                </td>
                <td className="p-2 border text-center" style={{ color: COLORS.text }}>
                  {events.filter((event) => event.type === "CLINIC").length}
                </td>
                <td className="p-2 border text-center" style={{ color: COLORS.text }}>
                  {events.filter((event) => event.type === "OPEN GYM").length}
                </td>
                <td className="p-2 border text-center" style={{ color: COLORS.text }}>
                  {events.filter((event) => ["KIDS NIGHT OUT", "CLINIC", "OPEN GYM"].includes(event.type)).length}
                </td>
                <td className="p-2 border" style={{ color: COLORS.text }}>
                  -
                </td>
                <td className="p-2 border text-center" style={{ color: COLORS.text }}>
                  {events.filter((event) => event.type === "Summer Camp").length}
                </td>
                <td className="p-2 border text-center" style={{ color: COLORS.text }}>
                  {events.length}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-md" style={{ overflow: "visible" }}>
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold" style={{ color: COLORS.text }}>
            {currentMonthInfo.monthYear} Calendar
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCalendarPage(1)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                calendarPage === 1 ? "text-white" : "hover:bg-gray-100"
              }`}
              style={{
                backgroundColor: calendarPage === 1 ? COLORS.primary : "transparent",
                color: calendarPage === 1 ? COLORS.white : COLORS.text,
              }}
            >
              Days 1-15
            </button>
            <button
              onClick={() => setCalendarPage(2)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                calendarPage === 2 ? "text-white" : "hover:bg-gray-100"
              }`}
              style={{
                backgroundColor: calendarPage === 2 ? COLORS.primary : "transparent",
                color: calendarPage === 2 ? COLORS.white : COLORS.text,
              }}
            >
              Days 16-30
            </button>
          </div>
        </div>

        <div className="overflow-x-auto" style={{ overflowY: "visible" }}>
          <table className="border-collapse min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border" style={{ color: COLORS.text }}>
                  Gym
                </th>
                {getDaysInMonth()
                  .slice(calendarPage === 1 ? 0 : 15, calendarPage === 1 ? 15 : 30)
                  .map((day, i) => {
                    const date = new Date(`${day}`)
                    const dayNum = calendarPage === 1 ? i + 1 : i + 16
                    const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
                    return (
                      <th key={i} className="p-2 border w-32 text-center" style={{ color: COLORS.text }}>
                        <div>{dayName}</div>
                        <div className="font-bold">{dayNum}</div>
                      </th>
                    )
                  })}
              </tr>
            </thead>
            <tbody style={{ position: "relative" }}>
              {(selectedGyms.has("all") ? allGyms : Array.from(selectedGyms)).map((gym, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td
                    ref={(el) => (gymRefs.current[gym] = el)}
                    className="p-2 border font-medium align-top scroll-mt-6"
                    style={{ color: COLORS.text }}
                  >
                    {gym}
                  </td>
                  {getDaysInMonth()
                    .slice(calendarPage === 1 ? 0 : 15, calendarPage === 1 ? 15 : 30)
                    .map((day, j) => (
                      <td key={j} className="p-2 border align-top h-24 relative overflow-visible">
                        {renderCalendarCell(gym, day)}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
