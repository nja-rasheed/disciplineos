'use client'

import { useState, useEffect, useTransition } from 'react'
import { startSession, endSession } from '@/app/actions' // Corrected to 'endSession'

// --- Define the props ---
// We need to get the list of categories from the parent page
type Category = {
  id: number
  name: string
}

type TimerProps = {
  categories: Category[]
}
// ------------------------

export default function Timer({ categories }: TimerProps) {
  // --- Your State ---
  const [isRunning, setIsRunning] = useState(false)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categories[0]?.id || null // Default to the first category
  )
  // ------------------

  // This hook gives us a loading state for our server actions
  const [isPending, startTransition] = useTransition()

  // --- THE TICKER LOGIC (useEffect) ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    // 1. THE "GATE": Only run this if the timer is on
    if (isRunning) {
      // 2. THE "TICKER": Start an interval that runs every 1 second
      interval = setInterval(() => {
        // 3. THE "COUNTER":
        // This is a "safe" way to update state
        // It says "get the previous value and add 1 to it"
        setElapsedTime((prevSeconds) => prevSeconds + 1)
      }, 1000)
    }

    // 4. THE "CLEANUP CREW":
    // This function runs when the component "cleans up"
    // (e.g., if `isRunning` changes to false)
    return () => {
      // If an interval exists, stop it.
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRunning]) // 5. THE "TRIGGER": Re-run this *entire* effect when `isRunning` changes

  // --- The functions to call our Server Actions ---

  const handleStart = () => {
    if (!selectedCategoryId) {
      alert('Please select a category first.')
      return
    }

    // We use startTransition to show a loading state
    startTransition(async () => {
      // 1. Call the server action
      const newSessionId = await startSession(selectedCategoryId)

      if (newSessionId) {
        // 2. Update our client state
        setSessionId(newSessionId)
        setIsRunning(true)
        setElapsedTime(0) // Reset the clock
      }
    })
  }

  const handleStop = () => {
    if (!sessionId) return

    startTransition(async () => {
      // 1. Call the server action
      await endSession(sessionId)

      // 2. Update our client state
      setIsRunning(false)
      setSessionId(null)
      // We keep setElapsedTime as is, so the user sees the final time
    })
  }

  // --- Helper to format the time ---
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    // Pads with leading zeros
    const pad = (num: number) => num.toString().padStart(2, '0')

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
  // ---------------------------------

  return (
    <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
      <div className="mb-4">
        {/* Category Selector */}
        <select
          value={selectedCategoryId || ''}
          onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
          disabled={isRunning}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Timer Display */}
      <div className="mb-6 text-center">
        <h2 className="font-mono text-6xl font-bold text-white">
          {formatTime(elapsedTime)}
        </h2>
      </div>

      {/* Start/Stop Buttons */}
      <div className="flex justify-center">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={isPending || !selectedCategoryId}
            className="rounded-lg bg-green-600 px-8 py-3 text-lg font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isPending ? 'Starting...' : 'Start'}
          </button>
        ) : (
          <button
            onClick={handleStop}
            disabled={isPending}
            className="rounded-lg bg-red-600 px-8 py-3 text-lg font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? 'Stopping...' : 'Stop'}
          </button>
        )}
      </div>
    </div>
  )
}