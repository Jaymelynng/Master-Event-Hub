"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export const DatabaseDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkDatabase() {
      try {
        // Check gyms count
        const { data: gyms, error: gymsError } = await supabase.from("gyms").select("*")

        // Check events count
        const { data: events, error: eventsError } = await supabase.from("events").select("*")

        // Check events_with_details view
        const { data: eventsView, error: viewError } = await supabase.from("events_with_details").select("*")

        setDebugInfo({
          gyms: { count: gyms?.length || 0, error: gymsError?.message },
          events: { count: events?.length || 0, error: eventsError?.message },
          eventsView: { count: eventsView?.length || 0, error: viewError?.message },
          sampleEvents: eventsView?.slice(0, 3) || [],
        })
      } catch (error) {
        setDebugInfo({ error: error.message })
      } finally {
        setLoading(false)
      }
    }

    checkDatabase()
  }, [])

  if (loading) return <div>Checking database...</div>

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold mb-4">Database Debug Info</h3>
      <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  )
}
