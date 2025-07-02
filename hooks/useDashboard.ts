"use client"

import { useState, useMemo } from "react"
import type { Event, DashboardMetrics, CopiedStates } from "@/types"
import { filterEvents, sortEvents } from "@/utils/eventUtils"
import { generateCopyText, copyToClipboard } from "@/utils/copyUtils"

export const useDashboard = (events: Event[]) => {
  const [selectedGyms, setSelectedGyms] = useState(new Set(["all"]))
  const [selectedEventTypes, setSelectedEventTypes] = useState(new Set(["all"]))
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("asc")
  const [selectedEvents, setSelectedEvents] = useState(new Set<number>())
  const [copiedStates, setCopiedStates] = useState<CopiedStates>({})

  // Get unique gyms and event types
  const allGyms = useMemo(() => [...new Set(events.map((event) => event.gymName).filter(Boolean))], [events])
  const allEventTypes = useMemo(() => [...new Set(events.map((event) => event.type).filter(Boolean))], [events])

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    const filtered = filterEvents(events, selectedGyms, selectedEventTypes, searchTerm)
    return sortEvents(filtered, sortBy, sortOrder)
  }, [events, selectedGyms, selectedEventTypes, searchTerm, sortBy, sortOrder])

  // Get dashboard metrics
  const metrics: DashboardMetrics = useMemo(() => {
    const typeCounts: Record<string, number> = {}
    events.forEach((event) => {
      if (event.type) {
        typeCounts[event.type] = (typeCounts[event.type] || 0) + 1
      }
    })

    const mostPopularType = Object.keys(typeCounts).reduce(
      (a, b) => (typeCounts[a] > typeCounts[b] ? a : b),
      Object.keys(typeCounts)[0] || "None",
    )

    const selectedFilteredEvents = filterEvents(events, selectedGyms, selectedEventTypes, "")

    return {
      totalEvents: events.length,
      totalGyms: allGyms.length,
      filteredEvents: selectedFilteredEvents.length,
      mostPopularType,
      averageEventsPerGym: allGyms.length > 0 ? (events.length / allGyms.length).toFixed(1) : "0",
    }
  }, [events, allGyms, selectedGyms, selectedEventTypes])

  // Multi-select handlers
  const toggleGymSelection = (gym: string) => {
    const newSelection = new Set(selectedGyms)
    if (gym === "all") {
      setSelectedGyms(new Set(["all"]))
    } else {
      newSelection.delete("all")
      if (newSelection.has(gym)) {
        newSelection.delete(gym)
        if (newSelection.size === 0) {
          newSelection.add("all")
        }
      } else {
        newSelection.add(gym)
      }
      setSelectedGyms(newSelection)
    }
  }

  const toggleEventTypeSelection = (type: string) => {
    const newSelection = new Set(selectedEventTypes)
    if (type === "all") {
      setSelectedEventTypes(new Set(["all"]))
    } else {
      newSelection.delete("all")
      if (newSelection.has(type)) {
        newSelection.delete(type)
        if (newSelection.size === 0) {
          newSelection.add("all")
        }
      } else {
        newSelection.add(type)
      }
      setSelectedEventTypes(newSelection)
    }
  }

  // Copy functionality
  const handleCopy = async (format: string) => {
    let targetEvents = []

    if (selectedEvents.size > 0) {
      targetEvents = filteredAndSortedEvents.filter((event) => selectedEvents.has(event.id))
    } else {
      targetEvents = filteredAndSortedEvents
    }

    const text = generateCopyText(targetEvents, format)
    const success = await copyToClipboard(text)

    if (success) {
      setCopiedStates((prev) => ({ ...prev, [`bulk-${format}`]: true }))
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [`bulk-${format}`]: false }))
      }, 2000)
    }
  }

  return {
    // State
    selectedGyms,
    selectedEventTypes,
    searchTerm,
    sortBy,
    sortOrder,
    selectedEvents,
    copiedStates,

    // Computed
    allGyms,
    allEventTypes,
    filteredAndSortedEvents,
    metrics,

    // Actions
    setSearchTerm,
    setSortBy,
    setSortOrder,
    setSelectedEvents,
    toggleGymSelection,
    toggleEventTypeSelection,
    handleCopy,
  }
}
