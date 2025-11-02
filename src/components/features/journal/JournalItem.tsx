'use client'

import { deleteJournalEntry } from '@/app/actions'
import { useTransition, useState } from 'react'

type Entry = {
  id: number
  entry_date: string
  content: string
}

export default function JournalEntryItem({ entry }: { entry: Entry }) {
  const [isDeleting, startDeleteTransition] = useTransition()
  
  // AI State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false)
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [mood, setMood] = useState<string | null>(null)
  const [experience, setExperience] = useState<string | null>(null)
  const [insights, setInsights] = useState<string | null>(null)
  const [aiError, setAiError] = useState<string | null>(null) // <-- Use state for errors

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      startDeleteTransition(async () => {
        // We should add error handling to this action too!
        await deleteJournalEntry(entry.id)
      })
    }
  }

  async function handleAiAnalyze() {
    setIsAiOpen(true)
    setIsAiAnalyzing(true)
    setAiError(null)
    setMood(null)
    setExperience(null)
    setInsights(null)

    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        body: JSON.stringify({ id: entry.id }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch analysis.')
      }
      
      if (data.result) {
        setMood(data.result.mood)
        setExperience(data.result.experience)
        setInsights(data.result.insights)
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setAiError((err as Error).message); // <-- Set the error state
    } finally {
      setIsAiAnalyzing(false)
    }
  }

  const closeAiPanel = () => {
    setIsAiOpen(false)
    setAiError(null)
    setMood(null)
    setExperience(null)
  }

  return (
    <li className="rounded-lg bg-gray-800 p-4 shadow">
      {/* Journal Entry Content */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          {new Date(entry.entry_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC',
          })}
        </h2>
        <form action={handleDelete}>
          <button
            type="submit"
            disabled={isDeleting}
            className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </form>
      </div>
      <p className="mt-2 text-gray-300">{entry.content}</p>

      {/* AI Analysis Section */}
      <div className="mt-4">
        {!isAiOpen ? (
          <button 
            onClick={handleAiAnalyze}
            className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Get AI Review
          </button>
        ) : (
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">AI Analysis:</h3>
              <button 
                onClick={closeAiPanel}
                className="text-gray-500 hover:text-white"
              >
                &times; {/* A simple 'X' close button */}
              </button>
            </div>
            
            {isAiAnalyzing ? (
              <p className="mt-2 text-gray-400">Analyzing...</p>
            ) : aiError ? (
              <p className="mt-2 text-red-400">{aiError}</p> // <-- Show the error
            ) : (
              <div className="mt-2 space-y-1">
                <p className="text-gray-300"><strong className="text-white">Mood:</strong> {mood}</p>
                <p className="text-gray-300"><strong className="text-white">Summary:</strong> {experience}</p>
                <p className="text-gray-300"><strong className="text-white">Insights:</strong> {insights}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  )
}