'use client'
import { useState } from 'react'
import { createJournalEntry } from '@/app/actions'

// 1. Define the props
type JournalFormProps = {
  // Allow today's entry to be null if it doesn't exist
  todaysEntry: {
    id: number
    content: string
  } | null
}

export default function JournalForm({ todaysEntry }: JournalFormProps) {
  // 2. Use the prop to set the initial state
  const [entryContent, setEntryContent] = useState(todaysEntry?.content || '')

  // The wrapper function clears the state *after* submit
  // but it doesn't run on page load
  async function action(formData: FormData) {
    await createJournalEntry(formData)
    // No need to clear here, revalidate will re-fetch
    // and re-set the initial state
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">
        {todaysEntry ? 'Edit Your Entry' : "Today's Entry"}
      </h2>
      <form action={action} className="mb-8">
        <div className="mb-4">
          <textarea
            name="content" // The critical key
            value={entryContent}
            onChange={(e) => setEntryContent(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
            placeholder="What's on your mind?"
            rows={6}
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          {todaysEntry ? 'Update Entry' : 'Save Entry'}
        </button>
      </form>
    </div>
  )
}