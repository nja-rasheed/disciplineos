'use client'

import { useState, useEffect } from 'react'
// We'll use lucide-react icons for a polished look
import { Sparkles, Brain, Lightbulb, AlertTriangle } from 'lucide-react'

export default function AiAnalytics() {
  // ---
  // FIX 1: Use singular to match the API response and add loading/error state
  // ---
  const [observation, setObservation] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [isLoading, setIsLoading] = useState(true) // Start in loading state
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAiAnalytics() {
      setIsLoading(true)
      setError(null)
      try {
        // ---
        // FIX 2: Fetch from the correct API route we created
        // ---
        const res = await fetch('/api/dashboard')
        const data = await res.json()

        if (!res.ok) {
          // Handle errors from the API (like 401, 404, 500)
          throw new Error(data.error || 'Failed to fetch AI analysis')
        }

        console.log('AI Analytics Data:', data)

        // ---
        // FIX 3: Access the data with the correct shape (no "feedback" wrapper)
        // ---
        setObservation(data.observation)
        setSuggestion(data.suggestion)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAiAnalytics()
  }, []) // The empty array ensures this runs once on mount

  return (
    // Main Container: Added gradient, border, and shadow for a premium feel
    <div className="relative overflow-hidden rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-xl shadow-indigo-500/10">
      {/* Background glow effect */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        <div className="h-64 w-64 animate-pulse rounded-full bg-indigo-500/30 blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        {/* Header with Icon */}
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Your AI Coach</h2>
        </div>

        {/* Conditional Content */}
        {isLoading ? (
          // --- Loading State ---
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-3/4 rounded bg-gray-700"></div>
            <div className="h-4 w-1/2 rounded bg-gray-700"></div>
          </div>
        ) : error ? (
          // --- Error State ---
          <div className="flex items-center gap-3 rounded-lg bg-red-900/50 p-3 text-red-400">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              <strong>Error:</strong> {error}
            </p>
          </div>
        ) : (
          // --- Success State ---
          <div className="space-y-5">
            {/* Observation Section */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 rounded-full bg-blue-900/50 p-2">
                <Brain className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-300">Observation</h3>
                <p className="text-white">{observation}</p>
              </div>
            </div>

            {/* Suggestion Section */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 rounded-full bg-green-900/50 p-2">
                <Lightbulb className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-300">Suggestion</h3>
                <p className="text-white">{suggestion}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

