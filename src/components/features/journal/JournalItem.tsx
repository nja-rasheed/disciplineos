'use client'

import { deleteJournalEntry } from '@/app/actions'
import { useTransition } from 'react'

type Entry = {
  id: number
  entry_date: string
  content: string
}

export default function JournalEntryItem({ entry }: { entry: Entry }) {
  const [isDeleting, startDeleteTransition] = useTransition()

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      startDeleteTransition(async () => {
        await deleteJournalEntry(entry.id)
      })
    }
  }

  return (
    <li className="rounded-lg bg-gray-800 p-4 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          {new Date(entry.entry_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC', // Ensure consistent date display
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
    </li>
  )
}