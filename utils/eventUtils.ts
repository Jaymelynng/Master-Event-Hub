import type { Event, EventType } from "@/types"

export const getEventTypeColor = (type: EventType): string => {
  switch (type) {
    case "OPEN GYM":
      return "bg-blue-50 text-gray-700 border-gray-200"
    case "KIDS NIGHT OUT":
      return "bg-rose-50 text-gray-700 border-rose-200"
    case "CLINIC":
      return "bg-green-50 text-gray-700 border-green-200"
    case "Summer Camp":
      return "bg-purple-50 text-gray-700 border-purple-200"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200"
  }
}

export const getDaysInMonth = (year?: number, month?: number): string[] => {
  const now = new Date()
  const currentYear = year || now.getFullYear()
  const currentMonth = month || now.getMonth() // 0-based (July = 6)
  
  // Get the month name
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })
  
  // Get number of days in the month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  
  const days = []
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(`${monthName} ${i}, ${currentYear}`)
  }
  return days
}

export const getCurrentMonthInfo = () => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const monthName = now.toLocaleString('default', { month: 'long' })
  
  return {
    year: currentYear,
    month: currentMonth,
    monthName,
    monthYear: `${monthName} ${currentYear}`
  }
}

export const filterEvents = (
  events: Event[],
  selectedGyms: Set<string>,
  selectedEventTypes: Set<string>,
  searchTerm: string,
): Event[] => {
  return events.filter((event) => {
    const matchesGym = selectedGyms.has("all") || selectedGyms.has(event.gymName)
    const matchesType = selectedEventTypes.has("all") || selectedEventTypes.has(event.type)
    const matchesSearch =
      searchTerm === "" ||
      (event.title && event.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.date && event.date.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.day && event.day.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.gymName && event.gymName.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesGym && matchesType && matchesSearch
  })
}

export const sortEvents = (events: Event[], sortBy: string, sortOrder: string): Event[] => {
  return [...events].sort((a, b) => {
    let aVal: any, bVal: any

    switch (sortBy) {
      case "date":
        aVal = a.date ? new Date(a.date.replace(/(\d+)(st|nd|rd|th)/, "$1")) : new Date(0)
        bVal = b.date ? new Date(b.date.replace(/(\d+)(st|nd|rd|th)/, "$1")) : new Date(0)
        break
      case "gym":
        aVal = a.gymName || ""
        bVal = b.gymName || ""
        break
      case "type":
        aVal = a.type || ""
        bVal = b.type || ""
        break
      case "title":
        aVal = a.title || ""
        bVal = b.title || ""
        break
      default:
        return 0
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
    return 0
  })
}
