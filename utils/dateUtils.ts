export const getDaysInMonth = (month: number, year: number): string[] => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = monthNames[month]

  const days = []
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(`${monthName} ${i}, ${year}`)
  }
  return days
}

export const getMonthYearFromDate = (dateString: string): { month: number; year: number } => {
  // Handle different date formats
  let date: Date

  try {
    // Try parsing the date string directly
    date = new Date(dateString)

    // If that doesn't work, try to parse manually
    if (isNaN(date.getTime())) {
      // Handle format like "July 11, 2025"
      const match = dateString.match(/(\w+)\s+(\d+),\s+(\d+)/)
      if (match) {
        const [, monthName, day, year] = match
        date = new Date(`${monthName} ${day}, ${year}`)
      } else {
        throw new Error(`Unable to parse date: ${dateString}`)
      }
    }
  } catch (error) {
    console.error("Error parsing date:", dateString, error)
    // Return current month/year as fallback
    const now = new Date()
    return {
      month: now.getMonth(),
      year: now.getFullYear(),
    }
  }

  return {
    month: date.getMonth(),
    year: date.getFullYear(),
  }
}

export const formatMonthYear = (month: number, year: number): string => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return `${monthNames[month]} ${year}`
}

export const isDateInMonth = (dateString: string, month: number, year: number): boolean => {
  try {
    const { month: eventMonth, year: eventYear } = getMonthYearFromDate(dateString)
    return eventMonth === month && eventYear === year
  } catch (error) {
    console.error("Error checking if date is in month:", dateString, error)
    return false
  }
}
