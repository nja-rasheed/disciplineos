'use client'

import { useState, useTransition } from 'react'
// 1. Import all the actions we need
import {
  toggleHabitCompletion,
  deleteHabit,
  updateHabit, // The new action
} from '@/app/actions'

// Define the types for the props
type Habit = {
  id: number
  name: string
  // Add other fields from 'habits' table if you need them
}

type HabitItemProps = {
  habit: Habit
  isCompleted: boolean
}

export default function HabitItem({ habit, isCompleted }: HabitItemProps) {
  // 2. Add state for editing
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null);

  // 3. Separate transitions for each async action
  const [isToggling, startToggleTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [isSaving, startSaveTransition] = useTransition()
  const [habitName, setHabitName] = useState(habit.name)

  const checkboxId = `habit-${habit.id}`

  // --- Action Handlers ---

  const handleToggle = () => {
    startToggleTransition(async () => {
      await toggleHabitCompletion(habit.id)
    })
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      startDeleteTransition(async () => {
        setError(null); // Clear old errors
        const result = await deleteHabit(habit.id)
        if (result?.error) {
          setError(result.error)
        }
      })
    }
  }

  // 4. New update handler for the form
  const handleUpdate = (formData: FormData) => {
    startSaveTransition(async () => {
      await updateHabit(formData)
      setIsEditing(false) // Close the edit form on success
    })
  }

  // --- Render Logic ---
  return (
    <div>
    <li className="rounded-lg bg-gray-800 p-4 shadow">
      {isEditing ? (
        // ========================
        // === EDITING VIEW ===
        // ========================
        <form action={handleUpdate} className="space-y-3">
          <input type="hidden" name="habit_id" value={habit.id} />
          <input
            type="text"
            name="name"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            required
            className="flex-1 rounded-lg border border-gray-700 bg-gray-700 p-2 text-white"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false)
                setHabitName(habit.name)
              }}
              className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      ) : (
        // ========================
        // === DEFAULT VIEW ===
        // ========================
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id={checkboxId}
              type="checkbox"
              checked={isCompleted}
              onChange={handleToggle}
              disabled={isToggling}
              className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor={checkboxId}
              className={`ml-3 text-lg font-medium text-white ${
                isToggling ? 'opacity-50' : ''
              } ${isCompleted ? 'line-through' : ''}`}
            >
              {habit.name}
            </label>
          </div>
          <div className="flex gap-4">
            {/* Edit Button */}
            <button
              onClick={() => {
                setIsEditing(true)
                setHabitName(habit.name)
              }}
              className="text-sm text-blue-400 hover:text-blue-600"
            >
              Edit
            </button>
            {/* Delete Form */}
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
        </div>
      )}
    </li>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}