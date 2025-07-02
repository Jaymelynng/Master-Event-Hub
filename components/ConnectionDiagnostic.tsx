"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react"
import { supabase, testSupabaseConnection } from "@/lib/supabase-unified"
import { COLORS } from "@/constants/theme"

interface DiagnosticResult {
  step: string
  status: "success" | "error" | "warning" | "loading"
  message: string
  details?: any
}

export const ConnectionDiagnostic = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostic = async () => {
    setIsRunning(true)
    setResults([])

    const addResult = (result: DiagnosticResult) => {
      setResults((prev) => [...prev, result])
    }

    // Step 1: Check environment variables
    addResult({
      step: "Environment Variables",
      status: "loading",
      message: "Checking environment variables...",
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      addResult({
        step: "Environment Variables",
        status: "error",
        message: "Missing required environment variables",
        details: {
          NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? "✅ Set" : "❌ Missing",
          NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey ? "✅ Set" : "❌ Missing",
        },
      })
      setIsRunning(false)
      return
    }

    addResult({
      step: "Environment Variables",
      status: "success",
      message: "Environment variables are set",
      details: {
        URL: supabaseUrl,
        Key: supabaseKey.substring(0, 20) + "...",
      },
    })

    // Step 2: Test basic connection
    addResult({
      step: "Basic Connection",
      status: "loading",
      message: "Testing Supabase connection...",
    })

    const connectionTest = await testSupabaseConnection()

    if (!connectionTest.success) {
      addResult({
        step: "Basic Connection",
        status: "error",
        message: "Failed to connect to Supabase",
        details: connectionTest.error,
      })
      setIsRunning(false)
      return
    }

    addResult({
      step: "Basic Connection",
      status: "success",
      message: "Successfully connected to Supabase",
    })

    // Step 3: Test table access
    addResult({
      step: "Table Access",
      status: "loading",
      message: "Testing table access...",
    })

    try {
      const { data: gyms, error: gymsError } = await supabase.from("gyms").select("*").limit(5)

      if (gymsError) {
        addResult({
          step: "Table Access",
          status: "error",
          message: "Cannot access gyms table",
          details: gymsError.message,
        })
      } else {
        addResult({
          step: "Table Access",
          status: "success",
          message: `Successfully accessed gyms table (${gyms?.length || 0} records found)`,
        })
      }
    } catch (error) {
      addResult({
        step: "Table Access",
        status: "error",
        message: "Table access failed",
        details: error.message,
      })
    }

    // Step 4: Test view access
    addResult({
      step: "View Access",
      status: "loading",
      message: "Testing view access...",
    })

    try {
      const { data: events, error: eventsError } = await supabase.from("events_with_details").select("*").limit(5)

      if (eventsError) {
        addResult({
          step: "View Access",
          status: "error",
          message: "Cannot access events_with_details view",
          details: eventsError.message,
        })
      } else {
        addResult({
          step: "View Access",
          status: "success",
          message: `Successfully accessed events view (${events?.length || 0} records found)`,
        })
      }
    } catch (error) {
      addResult({
        step: "View Access",
        status: "error",
        message: "View access failed",
        details: error.message,
      })
    }

    setIsRunning(false)
  }

  useEffect(() => {
    runDiagnostic()
  }, [])

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "loading":
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
    }
  }

  const getStatusColor = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "loading":
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6" style={{ color: COLORS.primary }} />
          <h3 className="text-xl font-bold" style={{ color: COLORS.text }}>
            Supabase Connection Diagnostic
          </h3>
        </div>
        <button
          onClick={runDiagnostic}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-colors"
          style={{ backgroundColor: isRunning ? COLORS.secondary : COLORS.primary }}
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
          {isRunning ? "Running..." : "Run Diagnostic"}
        </button>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(result.status)}
              <h4 className="font-semibold">{result.step}</h4>
            </div>
            <p className="text-sm mb-2">{result.message}</p>
            {result.details && (
              <div className="bg-white bg-opacity-50 rounded p-3 text-xs">
                <pre>{JSON.stringify(result.details, null, 2)}</pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {results.length === 0 && !isRunning && (
        <div className="text-center py-8 text-gray-500">Click "Run Diagnostic" to test your Supabase connection</div>
      )}
    </div>
  )
}
