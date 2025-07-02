"use client"

import { useState } from "react"
import { ExternalLink, Copy, CheckCircle, ChevronUp, ChevronDown } from "lucide-react"
import type { Event, SortField } from "@/types"
import { COLORS, EVENT_TYPE_COLORS } from "@/constants/theme"
import { copyToClipboard } from "@/utils/copyUtils"

interface TableViewProps {
  events: Event[]
  selectedEvents: Set<number>
  onEventSelect: (eventId: number) => void
  sortBy: string
  sortOrder: string
  onSort: (field: SortField, order: string) => void
}

export const TableView = ({ events, selectedEvents, onEventSelect, sortBy, sortOrder, onSort }: TableViewProps) => {
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

  const handleSort = (field: SortField) => {
    const newOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc"
    onSort(field, newOrder)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return null
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    )
  }

  const selectAll = () => {
    const allIds = new Set(events.map((event) => event.id))
    events.forEach((event) => onEventSelect(event.id))
  }

  const deselectAll = () => {
    selectedEvents.forEach((id) => onEventSelect(id))
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedEvents.size === events.length && events.length > 0}
                    onChange={selectedEvents.size === events.length ? deselectAll : selectAll}
                    className="rounded"
                  />
                  <span className="text-xs">
                    {selectedEvents.size > 0 ? `${selectedEvents.size} selected` : "Select"}
                  </span>
                </div>
              </th>
              <th
                className="p-3 text-left cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort("date")}
                style={{ color: COLORS.text }}
              >
                Date <SortIcon field="date" />
              </th>
              <th
                className="p-3 text-left cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort("gym")}
                style={{ color: COLORS.text }}
              >
                Gym <SortIcon field="gym" />
              </th>
              <th
                className="p-3 text-left cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort("type")}
                style={{ color: COLORS.text }}
              >
                Type <SortIcon field="type" />
              </th>
              <th
                className="p-3 text-left cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort("title")}
                style={{ color: COLORS.text }}
              >
                Event <SortIcon field="title" />
              </th>
              <th className="p-3 text-left" style={{ color: COLORS.text }}>
                Time
              </th>
              <th className="p-3 text-left" style={{ color: COLORS.text }}>
                Price
              </th>
              <th className="p-3 text-left" style={{ color: COLORS.text }}>
                Contact
              </th>
              <th className="p-3 text-left" style={{ color: COLORS.text }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr
                key={event.id}
                className={`border-t hover:bg-gray-50 transition-colors ${
                  selectedEvents.has(event.id) ? "bg-blue-50" : ""
                }`}
                style={{ borderColor: COLORS.border }}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedEvents.has(event.id)}
                    onChange={() => onEventSelect(event.id)}
                    className="rounded"
                  />
                </td>
                <td className="p-3" style={{ color: COLORS.text }}>
                  <div>
                    <div className="font-medium">{event.date}</div>
                    {event.day && <div className="text-sm text-gray-500">{event.day}</div>}
                  </div>
                </td>
                <td className="p-3" style={{ color: COLORS.text }}>
                  <div>
                    <div className="font-medium">{event.gymName}</div>
                    {event.gymAddress && <div className="text-sm text-gray-500">{event.gymAddress}</div>}
                  </div>
                </td>
                <td className="p-3">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: EVENT_TYPE_COLORS[event.type] || "#f3f4f6",
                      color: COLORS.text,
                      borderColor: COLORS.border,
                    }}
                  >
                    {event.type}
                  </span>
                </td>
                <td className="p-3" style={{ color: COLORS.text }}>
                  <div className="font-medium">{event.title}</div>
                </td>
                <td className="p-3" style={{ color: COLORS.text }}>
                  {event.time || "—"}
                </td>
                <td className="p-3" style={{ color: COLORS.text }}>
                  {event.price || "—"}
                </td>
                <td className="p-3" style={{ color: COLORS.text }}>
                  {event.gymPhone && <div className="text-sm">{event.gymPhone}</div>}
                </td>
                <td className="p-3">
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
                          onClick={() => handleCopy(event.url, `table-${event.id}`)}
                          className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:opacity-90"
                          style={{
                            backgroundColor: COLORS.border,
                            color: COLORS.text,
                          }}
                        >
                          {copiedStates[`table-${event.id}`] ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
