"use client"

import { AlertCircle, Database, FileText } from "lucide-react"

interface DataSourceIndicatorProps {
  dataSource: "sample" | "database"
  loading: boolean
  error: string | null
  eventsCount: number
}

export const DataSourceIndicator = ({ dataSource, loading, error, eventsCount }: DataSourceIndicatorProps) => {
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-800 font-medium">Loading data from Supabase...</span>
        </div>
      </div>
    )
  }

  if (dataSource === "database") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">
            ✅ Connected to Supabase Database ({eventsCount} events loaded)
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-yellow-600" />
            <span className="text-yellow-800 font-medium">Using Sample Data ({eventsCount} events)</span>
          </div>
          {error && <p className="text-sm text-yellow-700">Database connection issue: {error}</p>}
          <p className="text-sm text-yellow-700 mt-1">Check your Supabase environment variables to load real data.</p>
        </div>
      </div>
    </div>
  )
}
