'use client'
import { useState } from "react"
import { createHabit } from "@/app/actions"

export default function AddHabitForm() {
    const [name, setName] = useState("");
    async function action(formData: FormData) {
        // 1. Call your server action
        await createHabit(formData)
        
        // 2. Clear the form
        setName('')
    }

    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold">Add New Habit</h2>
            <form action={action} className="mb-8">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Habit name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        name="name"
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                    Add Habit
                </button>
            </form>
        </div>
    )

}