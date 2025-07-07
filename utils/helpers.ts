// Helper function for getting day of week from date string
export function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString)
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return dayNames[date.getDay()]
}

// Helper function to get month and year from events
export function getMonthYearFromEvents(events: any[]): string {
  if (events.length === 0) return "July 2025"

  const firstEvent = events[0]
  if (!firstEvent.date) return "July 2025"

  const dateParts = firstEvent.date.match(/(\w+ \d+)/)
  return dateParts ? dateParts[1] : "July 2025"
}
