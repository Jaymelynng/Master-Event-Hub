"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export const SupabaseTest = () => {
  const [status, setStatus] = useState("Testing connection...")
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        // Test 1: Basic connection
        setStatus("Testing basic connection...")

        // Test 2: Check if we can query gyms table
        const { data: gymsData, error: gymsError } = await supabase.from("gyms").select("*").limit(5)

        if (gymsError) {
          setStatus(`Gyms table error: ${gymsError.message}`)
          setDetails(gymsError)
          return
        }

        // Test 3: Check if we can query events_with_details view
        const { data: eventsData, error: eventsError } = await supabase.from("events_with_details").select("*").limit(5)

        if (eventsError) {
          setStatus(`Events view error: ${eventsError.message}`)
          setDetails(eventsError)
          return
        }

        setStatus("✅ Connection successful!")
        setDetails({
          gymsCount: gymsData?.length || 0,
          eventsCount: eventsData?.length || 0,
          sampleGym: gymsData?.[0],
          sampleEvent: eventsData?.[0],
        })
      } catch (error) {
        setStatus(`❌ Connection failed: ${error.message}`)
        setDetails(error)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold mb-4">Supabase Connection Test</h3>

      <div className="mb-4">
        <strong>Status:</strong> {status}
      </div>

      {details && (
        <div className="bg-gray-100 p-4 rounded">
          <strong>Details:</strong>
          <pre className="text-sm mt-2 overflow-auto">{JSON.stringify(details, null, 2)}</pre>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}
        </p>
        <p>
          <strong>Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...
        </p>
      </div>
    </div>
  )
}
