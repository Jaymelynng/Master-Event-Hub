"use client"

import { useState } from "react"
import { ExternalLink, Copy, CheckCircle, MapPin, Phone, Clock, DollarSign, Users, Calendar } from "lucide-react"
import type { Event } from "@/types"
import { COLORS, EVENT_TYPE_COLORS } from "@/constants/theme"
import { copyToClipboard } from "@/utils/copyUtils"

interface DetailViewProps {
  events: Event[]
  allGyms: string[]
}

export const DetailView = ({ events, allGyms }: DetailViewProps) => {
  const [selectedGym, setSelectedGym] = useState<string>(allGyms[0] || "")
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})

  const handleCopy = async (text: string, id: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopiedStates((prev) => ({ ...prev, [id]: true }))
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [id]: false }))
      }, 2000)
    }
  }

  const selectedGymEvents = events.filter((event) => event.gymName === selectedGym)

  // Get gym statistics
  const getGymStats = (gymName: string) => {
    const gymEvents = events.filter((event) => event.gymName === gymName)
    const knoCount = gymEvents.filter((event) => event.type === "KIDS NIGHT OUT").length
    const clinicCount = gymEvents.filter((event) => event.type === "CLINIC").length
    const openGymCount = gymEvents.filter((event) => event.type === "OPEN GYM").length
    const summerCampCount = gymEvents.filter((event) => event.type === "Summer Camp").length

    return { knoCount, clinicCount, openGymCount, summerCampCount, total: gymEvents.length }
  }

  return (
    <div className="flex gap-6 h-[800px]">
      {/* Left Panel - Gym List */}
      <div className="w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b" style={{ borderColor: COLORS.border }}>
          <h3 className="font-bold text-lg" style={{ color: COLORS.text }}>
            Gymnastics Centers ({allGyms.length})
          </h3>
        </div>
        <div className="overflow-y-auto h-full">
          {allGyms.map((gym) => {
            const stats = getGymStats(gym)
            const isSelected = selectedGym === gym

            return (
              <button
                key={gym}
                onClick={() => setSelectedGym(gym)}
                className={`w-full p-4 text-left border-b transition-colors hover:bg-gray-50 ${
                  isSelected ? "bg-blue-50 border-l-4" : ""
                }`}
                style={{
                  borderColor: COLORS.border,
                  borderLeftColor: isSelected ? COLORS.primary : "transparent",
                }}
              >
                <div className="font-semibold mb-2" style={{ color: COLORS.text }}>
                  {gym}
                </div>
                <div className="flex items-center gap-4 text-sm" style={{ color: COLORS.text }}>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{stats.total} events</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>KNO: {stats.knoCount}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {stats.knoCount > 0 && (
                    <span
                      className="px-2 py-1 text-xs rounded"
                      style={{ backgroundColor: EVENT_TYPE_COLORS["KIDS NIGHT OUT"] }}
                    >
                      KNO
                    </span>
                  )}
                  {stats.clinicCount > 0 && (
                    <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: EVENT_TYPE_COLORS.CLINIC }}>
                      Clinic
                    </span>
                  )}
                  {stats.openGymCount > 0 && (
                    <span
                      className="px-2 py-1 text-xs rounded"
                      style={{ backgroundColor: EVENT_TYPE_COLORS["OPEN GYM"] }}
                    >
                      Open Gym
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right Panel - Gym Details */}
      <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
        {selectedGym ? (
          <>
            {/* Gym Header */}
            <div className="p-6 border-b" style={{ borderColor: COLORS.border }}>
              <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
                {selectedGym}
              </h2>
              {selectedGymEvents[0] && (
                <div className="space-y-1 text-sm" style={{ color: COLORS.text }}>
                  {selectedGymEvents[0].gymAddress && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedGymEvents[0].gymAddress}</span>
                    </div>
                  )}
                  {selectedGymEvents[0].gymPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{selectedGymEvents[0].gymPhone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Stats */}
              <div className="flex gap-4 mt-4">
                {Object.entries(getGymStats(selectedGym)).map(([key, value]) => {
                  if (key === "total") return null
                  const label = key
                    .replace("Count", "")
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                  return (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                        {value}
                      </div>
                      <div className="text-xs" style={{ color: COLORS.text }}>
                        {label}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Events List */}
            <div className="p-6 overflow-y-auto h-full">
              <h3 className="font-semibold mb-4" style={{ color: COLORS.text }}>
                Events ({selectedGymEvents.length})
              </h3>

              <div className="space-y-4">
                {selectedGymEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    style={{ borderColor: COLORS.border }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold" style={{ color: COLORS.text }}>
                          {event.title}
                        </h4>
                        <span
                          className="inline-block px-2 py-1 text-xs rounded mt-1"
                          style={{ backgroundColor: EVENT_TYPE_COLORS[event.type] }}
                        >
                          {event.type}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {event.url && (
                          <>
                            <a
                              href={event.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1 text-white text-sm rounded hover:opacity-90"
                              style={{ backgroundColor: COLORS.primary }}
                            >
                              <ExternalLink className="w-3 h-3" />
                              Book
                            </a>
                            <button
                              onClick={() => handleCopy(event.url, `detail-${event.id}`)}
                              className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:opacity-90"
                              style={{
                                backgroundColor: COLORS.border,
                                color: COLORS.text,
                              }}
                            >
                              {copiedStates[`detail-${event.id}`] ? (
                                <CheckCircle className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm" style={{ color: COLORS.text }}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {event.date} {event.day && `(${event.day})`}
                        </span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.price && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>{event.price}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p style={{ color: COLORS.text }}>Select a gym to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
