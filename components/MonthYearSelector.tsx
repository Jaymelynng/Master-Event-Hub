"use client"

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { COLORS } from "@/constants/theme"

interface MonthYearSelectorProps {
  selectedMonth: number
  selectedYear: number
  onMonthChange: (month: number) => void
  onYearChange: (year: number) => void
  availableMonths: { month: number; year: number; count: number }[]
}

export const MonthYearSelector = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  availableMonths,
}: MonthYearSelectorProps) => {
  const months = [
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

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i - 2) // 2 years back, current, 2 years forward

  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11)
      onYearChange(selectedYear - 1)
    } else {
      onMonthChange(selectedMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0)
      onYearChange(selectedYear + 1)
    } else {
      onMonthChange(selectedMonth + 1)
    }
  }

  const getEventsCountForMonth = (month: number, year: number) => {
    const monthData = availableMonths.find((m) => m.month === month && m.year === year)
    return monthData ? monthData.count : 0
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6" style={{ borderColor: COLORS.border, borderWidth: "1px" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5" style={{ color: COLORS.primary }} />
          <h3 className="font-semibold text-lg" style={{ color: COLORS.text }}>
            Select Month & Year
          </h3>
        </div>

        <div className="flex items-center gap-4">
          {/* Navigation Arrows */}
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" style={{ color: COLORS.text }} />
          </button>

          {/* Month Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(Number(e.target.value))}
              className="px-3 py-2 border rounded-md text-lg font-medium"
              style={{ borderColor: COLORS.border, color: COLORS.text }}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month} ({getEventsCountForMonth(index, selectedYear)} events)
                </option>
              ))}
            </select>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="px-3 py-2 border rounded-md text-lg font-medium"
              style={{ borderColor: COLORS.border, color: COLORS.text }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-5 h-5" style={{ color: COLORS.text }} />
          </button>
        </div>
      </div>

      {/* Quick Month Navigation */}
      <div className="mt-4 flex flex-wrap gap-2">
        {availableMonths.map(({ month, year, count }) => (
          <button
            key={`${month}-${year}`}
            onClick={() => {
              onMonthChange(month)
              onYearChange(year)
            }}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              selectedMonth === month && selectedYear === year ? "text-white" : "hover:bg-gray-100"
            }`}
            style={{
              backgroundColor: selectedMonth === month && selectedYear === year ? COLORS.primary : "transparent",
              color: selectedMonth === month && selectedYear === year ? COLORS.white : COLORS.text,
            }}
          >
            {months[month]} {year} ({count})
          </button>
        ))}
      </div>
    </div>
  )
}
