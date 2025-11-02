'use client'
import { useState } from "react"
import { createGoal } from "@/app/actions"

type AddGoalFormProps = {
    parentCategories?: { id: number; name: string }[];
}
export default function AddGoalForm({parentCategories} : AddGoalFormProps) {
    const [goalTitle, setGoalTitle] = useState("");

    async function action(formData: FormData) {
            // 1. Call your server action
            await createGoal(formData)
            
            // 2. Clear the form
            setGoalTitle('')
    }

    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold">Add New Goal</h2>
            <form action={action} className="mb-8">
                <div className="mb-4">
                    <input
                        type="text"
                        name="title"
                        value={goalTitle}
                        onChange={(e) => setGoalTitle(e.target.value)}
                        placeholder="Enter your goal"
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
                    />
                    <select
                        name="priority"
                        className="mt-4 w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
                        required
                    >
                        <option value="3">Low</option>
                        <option value="2">Medium</option>
                        <option value="1">High</option>
                    </select>
                    <select name="parent_category_id"
                        className="mt-4 w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
                    >
                        {parentCategories?.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="mt-2 w-full rounded-lg bg-blue-600 p-2 text-white">
                        Add Goal
                    </button>
                </div>
            </form>
        </div>
    )
}