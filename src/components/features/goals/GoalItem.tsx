'use client'

import { useState, useTransition } from 'react'
import { updateGoal, deleteGoal } from '@/app/actions'

// Import sub-task components
import AddSubTaskForm from './AddSubTaskForm'
import SubTaskItem from './SubTaskItem'
import GoalPercentagePage from './Percentage'

// --- Define Types ---
// These must match the data you're fetching in your GoalsPage
type SubTask = {
  id: number
  title: string
  is_completed: boolean
  goal_id: number
  user_id: string
}

type ParentCategory = {
  id: number
  name: string
}

type Goal = {
  id: number
  title: string
  priority: number
  parent_categories: { name: string } | null // This is for display
  parent_category_id: number | null // <--- ADD THIS (for the form)
  sub_tasks: SubTask[]
}
// --------------------

type GoalItemProps = {
  goal: Goal
  parentCategories: ParentCategory[] // Pass the full list for the dropdown
}

export default function GoalItem({ goal, parentCategories }: GoalItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, startSaveTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()

  // State for the controlled edit form
  const [newTitle, setNewTitle] = useState(goal.title)
  const [newPriority, setNewPriority] = useState(goal.priority.toString())
  const [newParentCatId, setNewParentCatId] = useState(
    goal.parent_category_id ? goal.parent_category_id.toString() : ''
  )

  //state for AI plan
  const [isAiPlanPannelOpen, setIsAiPlanPannelOpen] = useState(false);
  const [aiPlan, setAiPlan] = useState<string[]>([]);
  const [isFetchingPlan, setIsFetchingPlan] = useState(false);

  // --- Action Handlers ---
  const handleUpdate = (formData: FormData) => {
    startSaveTransition(async () => {
      await updateGoal(formData)
      setIsEditing(false) // Close form on save
    })
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${goal.title}"?`)) {
      startDeleteTransition(async () => {
        await deleteGoal(goal.id)
      })
    }
  }

  const handleCancel = () => {
    // ... (reset newTitle, newPriority) ...

    // FIX 2: Use the raw parent_category_id here too
    setNewParentCatId(
      goal.parent_category_id ? goal.parent_category_id.toString() : ''
    )
  }
  async function handleAiPlan(id: number) {
    setIsFetchingPlan(true);
    setIsAiPlanPannelOpen(true);
    try {
      const response = await fetch(`/api/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId: id }),
      });
      const data = await response.json();
      setAiPlan(data.suggested_steps || []);
    } catch (err) {
      console.error('Error fetching AI plan:', err);
    } finally {
      setIsFetchingPlan(false);
    }
  }

  return (
    <li className="rounded-lg bg-gray-800 p-4 shadow">
      {isEditing ? (
        // ========================
        // === EDITING VIEW ===
        // ========================
        <form action={handleUpdate} className="space-y-4">
          <input type="hidden" name="goal_id" value={goal.id} />
          {/* Title Input */}
          <input
            type="text"
            name="title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-700 bg-gray-700 p-2 text-white"
          />
          {/* Priority Select */}
          <select
            name="priority"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
            required
          >
            <option value="3">Low Priority</option>
            <option value="2">Medium Priority</option>
            <option value="1">High Priority</option>
          </select>
          {/* Parent Category Select */}
          <select
            name="parent_category_id"
            value={newParentCatId}
            onChange={(e) => setNewParentCatId(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
          >
            <option value="">No Parent Category</option>
            {parentCategories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
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
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{goal.title}</h2>
            {/* Edit/Delete Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-400 hover:text-blue-600"
              >
                Edit
              </button>
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
          {/* Goal Details */}
          <h3 className="text-sm font-medium text-gray-400">
            Priority:{' '}
            {goal.priority === 1 ? 'High' : goal.priority === 2 ? 'Medium' : 'Low'}
          </h3>
          <h3 className="text-sm font-medium text-gray-400">
            Category: {goal.parent_categories?.name || 'None'}
          </h3>
          
          {/* Sub-task Components (moved from the page) */}
          <GoalPercentagePage subTasks={goal.sub_tasks || []} />
          {/* --- AI PLAN SECTION --- */}
          {/* === AI PLAN BUTTON === */}
          <button
            onClick={() => handleAiPlan(goal.id)}
            disabled={isFetchingPlan}
            className={`mt-3 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              isFetchingPlan
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isFetchingPlan ? (
              <>
                <span className="animate-spin inline-block">⏳</span>
                Generating Plan...
              </>
            ) : (
              <>
                <span>✨</span>
                Get AI Plan
              </>
            )}
          </button>

          {/* === AI PLAN PANEL === */}
          {isAiPlanPannelOpen && (
            <div
              className="mt-4 rounded-xl border border-gray-700 bg-gray-900/80 p-5 shadow-md backdrop-blur transition-all duration-500 ease-in-out"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-lg">💡</span>
                  <h3 className="text-lg font-semibold text-indigo-400">
                    {isFetchingPlan ? 'Generating Your Plan...' : 'AI Suggested Steps'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAiPlanPannelOpen(false)}
                  className="text-gray-400 hover:text-red-400 text-lg transition"
                >
                  ❌
                </button>
              </div>

              {/* Loader while fetching */}
              {isFetchingPlan ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="animate-spin text-indigo-400">⚙️</span>
                  <span>Analyzing your goal and generating steps...</span>
                </div>
              ) : aiPlan.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {aiPlan.map((step, index) => (
                    <li key={index} className="text-gray-300 flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5">✨</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic flex items-center gap-2">
                  <span className="text-yellow-400">💭</span>
                  No steps were generated for this goal.
                </p>
              )}
            </div>
          )}

          <AddSubTaskForm goalId={goal.id} />
          <ul className="mt-2 list-disc list-inside">
            {goal.sub_tasks && goal.sub_tasks.length > 0 ? (
              goal.sub_tasks.map((subTask) => (
                <SubTaskItem key={subTask.id} subTask={subTask} />
              ))
            ) : (
              <li className="text-gray-400">No sub-tasks found.</li>
            )}
          </ul>
        </div>
      )}
    </li>
  )
}