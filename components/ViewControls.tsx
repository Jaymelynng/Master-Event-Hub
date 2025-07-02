"use client"

import { Grid, List, CalendarDays, Settings, Building } from "lucide-react"
import type { ViewMode } from "@/types"
import { COLORS } from "@/constants/theme"

interface ViewControlsProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  filteredEventsCount: number
  selectedEventsCount: number
}

export const ViewControls = ({
  viewMode,
  onViewModeChange,
  filteredEventsCount,
  selectedEventsCount,
}: ViewControlsProps) => {
  const getButtonStyle = (mode: ViewMode) => ({
    backgroundColor: viewMode === mode ? COLORS.primary : "transparent",
    color: viewMode === mode ? COLORS.white : COLORS.text,
  })

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6" style={{ borderColor: COLORS.border, borderWidth: "1px" }}>
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: COLORS.text }}>
              Choose View:
            </span>
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: "#f3f4f6" }}>
              <button
                onClick={() => onViewModeChange("cards")}
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium"
                style={getButtonStyle("cards")}
                title="Card View - Events as cards"
              >
                <Grid className="w-4 h-4" />
                Cards
              </button>
              <button
                onClick={() => onViewModeChange("table")}
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium"
                style={getButtonStyle("table")}
                title="Table View - Events in rows"
              >
                <List className="w-4 h-4" />
                Table
              </button>
              <button
                onClick={() => onViewModeChange("detail")}
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium"
                style={getButtonStyle("detail")}
                title="Detail View - Two panel layout"
              >
                <Building className="w-4 h-4" />
                Detail
              </button>
              <button
                onClick={() => onViewModeChange("calendar")}
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium"
                style={getButtonStyle("calendar")}
                title="Calendar View - Monthly grid"
              >
                <CalendarDays className="w-4 h-4" />
                Calendar
              </button>
              <button
                onClick={() => onViewModeChange("admin")}
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium"
                style={getButtonStyle("admin")}
                title="Admin - Bulk Import & Settings"
              >
                <Settings className="w-4 h-4" />
                Admin
              </button>
            </div>
          </div>
        </div>

        <div className="text-sm" style={{ color: COLORS.text }}>
          {selectedEventsCount > 0 ? `${selectedEventsCount} selected` : `${filteredEventsCount} events`}
        </div>
      </div>
    </div>
  )
}
