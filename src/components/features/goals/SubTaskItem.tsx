'use client'

import { useState, useTransition } from 'react'
// 1. Import all the actions we need
import {
  toggleSubTaskCompletion,
  updateSubTask,
  deleteSubTask,
} from '@/app/actions'

// Define the type for the prop
type SubTask = {
  id: number
  title: string
  is_completed: boolean
}

type SubTaskItemProps = {
  subTask: SubTask
}

export default function SubTaskItem({ subTask }: SubTaskItemProps) {
  // 2. Add state for editing and transitions
  const [isEditing, setIsEditing] = useState(false)
  const [isToggling, startToggleTransition] = useTransition()
  const [isSaving, startSaveTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [newTitle, setNewTitle] = useState(subTask.title)

  const checkboxId = `subtask-${subTask.id}`

  // --- Action Handlers ---

  const handleToggle = () => {
    startToggleTransition(async () => {
      await toggleSubTaskCompletion(subTask.id, subTask.is_completed)
    })
  }

  const handleUpdate = (formData: FormData) => {
    startSaveTransition(async () => {
      await updateSubTask(formData)
      setIsEditing(false)
    })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this sub-task?')) {
      startDeleteTransition(async () => {
        await deleteSubTask(subTask.id)
      })
    }
  }

  // --- Render Logic ---
  return (
    <li className="flex flex-col rounded-lg bg-gray-900 p-2 pl-3">
      {isEditing ? (
        // ========================
        // === EDITING VIEW ===
        // ========================
        <form action={handleUpdate} className="space-y-2">
          <input type="hidden" name="sub_task_id" value={subTask.id} />
          <input
            type="text"
            name="title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-700 bg-gray-700 p-2 text-sm text-white"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false)
                setNewTitle(subTask.title) // Reset on cancel
              }}
              className="rounded-lg bg-gray-600 px-3 py-1 text-xs font-semibold text-white hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
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
              checked={subTask.is_completed}
              onChange={handleToggle}
              disabled={isToggling}
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor={checkboxId}
              className={`ml-2 text-gray-300 ${isToggling ? 'opacity-50' : ''} ${
                subTask.is_completed ? 'line-through opacity-70' : ''
              }`}
            >
              {subTask.title}
            </label>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setNewTitle(subTask.title) // Sync state before editing
                setIsEditing(true)
              }}
              className="text-xs text-blue-400 hover:text-blue-600"
            >
              Edit
            </button>
            <form action={handleDelete}>
              <button
                type="submit"
                disabled={isDeleting}
                className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </form>
          </div>
        </div>
      )}
    </li>
  )
}