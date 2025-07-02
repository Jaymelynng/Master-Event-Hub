import type { DashboardMetrics } from "@/types"
import { COLORS } from "@/constants/theme"

interface DashboardStatsProps {
  metrics: DashboardMetrics
  selectedEventsCount: number
}

export const DashboardStats = ({ metrics, selectedEventsCount }: DashboardStatsProps) => {
  return (
    <div className="flex flex-row gap-2 md:gap-4 mb-6 overflow-x-auto">
      <div
        className="bg-white rounded-lg shadow-md p-3 md:p-4 flex-1 min-w-[120px]"
        style={{ borderColor: COLORS.border, borderWidth: "1px" }}
      >
        <p className="text-xs md:text-sm whitespace-nowrap" style={{ color: COLORS.text }}>
          Total Events
        </p>
        <p className="text-xl md:text-2xl font-bold" style={{ color: COLORS.primary }}>
          {metrics.totalEvents}
        </p>
      </div>

      <div
        className="bg-white rounded-lg shadow-md p-3 md:p-4 flex-1 min-w-[120px]"
        style={{ borderColor: COLORS.border, borderWidth: "1px" }}
      >
        <p className="text-xs md:text-sm whitespace-nowrap" style={{ color: COLORS.text }}>
          Total Gyms
        </p>
        <p className="text-xl md:text-2xl font-bold" style={{ color: COLORS.secondary }}>
          {metrics.totalGyms}
        </p>
      </div>

      <div
        className="bg-white rounded-lg shadow-md p-3 md:p-4 flex-1 min-w-[120px]"
        style={{ borderColor: COLORS.border, borderWidth: "1px" }}
      >
        <p className="text-xs md:text-sm whitespace-nowrap" style={{ color: COLORS.text }}>
          Filtered Events
        </p>
        <p className="text-xl md:text-2xl font-bold" style={{ color: COLORS.tertiary }}>
          {metrics.filteredEvents}
        </p>
      </div>

      <div
        className="bg-white rounded-lg shadow-md p-3 md:p-4 flex-1 min-w-[120px]"
        style={{ borderColor: COLORS.border, borderWidth: "1px" }}
      >
        <p className="text-xs md:text-sm whitespace-nowrap" style={{ color: COLORS.text }}>
          Selected Events
        </p>
        <p className="text-xl md:text-2xl font-bold" style={{ color: COLORS.primary }}>
          {selectedEventsCount}
        </p>
      </div>
    </div>
  )
}
