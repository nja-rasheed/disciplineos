'use client'
import { useState } from "react"
import { createSubTask } from "@/app/actions"

export default function AddSubTaskForm({ goalId }: { goalId: number }) {
    const [subTaskTitle, setSubTaskTitle] = useState("");
    async function action(formData: FormData) {
        // 1. Call your server action
        await createSubTask(formData)
        // 2. Clear the form
        setSubTaskTitle('')
    }
    return (
        <div className="mt-4">
            <h3 className="mb-2 text-xl font-semibold">Add New Sub-Task</h3>
            <form action={action} className="mb-4">
                <input
                    type="text"
                    name="sub_task_title"
                    value={subTaskTitle}
                    onChange={(e) => setSubTaskTitle(e.target.value)}
                    placeholder="Sub-Task Title"
                    className="w-full rounded-md border border-gray-300 p-2"
                />
                <input type="hidden" name="goal_id" value={goalId} />
                <button
                    type="submit"
                    className="mt-2 w-full rounded-md bg-blue-600 p-2 text-white"
                >
                    Add Sub-Task
                </button>
            </form>
        </div>
    )
}