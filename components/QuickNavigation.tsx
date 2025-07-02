"use client"

import { Building, X } from "lucide-react"
import { COLORS } from "@/constants/theme"

interface QuickNavigationProps {
  gyms: string[]
  onGymClick: (gym: string) => void
  onClose: () => void
}

export const QuickNavigation = ({ gyms, onGymClick, onClose }: QuickNavigationProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6" style={{ borderColor: COLORS.border, borderWidth: "1px" }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg flex items-center gap-2" style={{ color: COLORS.text }}>
          <Building className="w-5 h-5" />
          Jump to Gym
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {gyms.map((gym) => (
          <button
            key={gym}
            onClick={() => onGymClick(gym)}
            className="px-4 py-3 text-sm font-medium rounded-lg hover:opacity-90 transition-all text-left"
            style={{
              backgroundColor: COLORS.primary,
              color: COLORS.white,
            }}
          >
            <div className="truncate">{gym}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
