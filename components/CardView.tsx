"use client"

import { useState } from "react"
import { ExternalLink, Copy, CheckCircle, MapPin, Phone, Clock, DollarSign } from "lucide-react"
import type { Event } from "@/types"
import { COLORS, EVENT_TYPE_COLORS } from "@/constants/theme"
import { copyToClipboard } from "@/utils/copyUtils"

interface CardViewProps {
  events: Event[]
  selectedEvents: Set<number>
  onEventSelect: (eventId: number) => void
}

export const CardView = ({ events, selectedEvents, onEventSelect }: CardViewProps) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-lg shadow-md border transition-all duration-200 hover:shadow-lg"
          style={{ borderColor: COLORS.border }}
        >
          {/* Event Type Header */}
          <div
            className="px-4 py-3 rounded-t-lg"
            style={{ backgroundColor: EVENT_TYPE_COLORS[event.type] || "#f3f4f6" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm" style={{ color: COLORS.text }}>
                {event.type}
              </span>
              <input
                type="checkbox"
                checked={selectedEvents.has(event.id)}
                onChange={() => onEventSelect(event.id)}
                className="rounded"
              />
            </div>
          </div>

          {/* Event Content */}
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2" style={{ color: COLORS.text }}>
              {event.title}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.text }}>
                <Clock className="w-4 h-4" />
                <span>
                  {event.date} {event.day ? `(${event.day})` : ""}
                </span>
              </div>

              {event.time && (
                <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.text }}>
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
              )}

              {event.price && (
                <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.text }}>
                  <DollarSign className="w-4 h-4" />
                  <span>{event.price}</span>
                </div>
              )}
            </div>

            {/* Gym Info */}
            <div className="border-t pt-3 mb-4" style={{ borderColor: COLORS.border }}>
              <h4 className="font-semibold mb-2" style={{ color: COLORS.text }}>
                {event.gymName}
              </h4>

              {event.gymAddress && (
                <div className="flex items-center gap-2 text-sm mb-1" style={{ color: COLORS.text }}>
                  <MapPin className="w-4 h-4" />
                  <span>{event.gymAddress}</span>
                </div>
              )}

              {event.gymPhone && (
                <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.text }}>
                  <Phone className="w-4 h-4" />
                  <span>{event.gymPhone}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {event.url && (
                <>
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 text-white text-sm rounded hover:opacity-90 flex-1 justify-center"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Book Now
                  </a>
                  <button
                    onClick={() => handleCopy(event.url, `card-${event.id}`)}
                    className="flex items-center gap-1 px-3 py-2 text-sm rounded hover:opacity-90"
                    style={{
                      backgroundColor: COLORS.border,
                      color: COLORS.text,
                    }}
                  >
                    {copiedStates[`card-${event.id}`] ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
