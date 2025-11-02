'use client'

// 1. Import new action and hook
import { deleteTimeCategory, updateTimeCategory } from '@/app/actions'
import { useState, useTransition } from 'react'

type Category = {
  id: number
  name: string
  color: string | null
}

export default function CategoryItem({ category }: { category: Category }) {
  // 2. Add state for edit mode and transitions
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, startDeleteTransition] = useTransition()
  const [isSaving, startSaveTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // --- Delete Handler ---
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      startDeleteTransition(async () => {
        setError(null); // Clear old errors
        const result = await deleteTimeCategory(category.id)
        if (result?.error) {
          setError(result.error)
        }
      })
    }
  }

  // --- Save (Update) Handler ---
  // This function will be called by our new form's action
  const handleUpdate = (formData: FormData) => {
    startSaveTransition(async () => {
      await updateTimeCategory(formData)
      setIsEditing(false) // Close the form on success
    })
  }

  // --- JSX with Conditional Logic ---
  return (
    <div>
    <li className="rounded-lg bg-gray-800 p-4 shadow">
      {isEditing ? (
        // ========================
        // === EDITING VIEW ===
        // ========================
        <form action={handleUpdate} className="space-y-3">
          {/* This input is hidden. It passes the ID to the server action. */}
          <input type="hidden" name="category_id" value={category.id} />
          
          <div className="flex gap-2">
            {/* Color Picker */}
            <input
              type="color"
              name="color"
              defaultValue={category.color || '#888888'}
              className="h-10 w-10 rounded-lg border-none bg-gray-700"
            />
            {/* Name Input */}
            <input
              type="text"
              name="name"
              defaultValue={category.name}
              required
              className="flex-1 rounded-lg border border-gray-700 bg-gray-700 p-2 text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            {/* Cancel Button */}
            <button
              type="button" // Important: type="button" to not submit the form
              onClick={() => setIsEditing(false)}
              className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
            >
              Cancel
            </button>
            {/* Save Button */}
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
            <span
              className="mr-3 inline-block h-4 w-4 rounded-full"
              style={{ backgroundColor: category.color || '#888' }}
            ></span>
            <span className="text-lg font-medium">{category.name}</span>
          </div>
          <div className="flex gap-4">
            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-400 hover:text-blue-600"
            >
              Edit
            </button>
            {/* Delete Button (wrapped in form) */}
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