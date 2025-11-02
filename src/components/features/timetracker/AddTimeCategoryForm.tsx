'use client';
import { useState } from "react";
import { createTimeCategory } from "@/app/actions";

type AddTimeCategoryFormProps = {
  // You can add props if needed
  parentCategory: { id: number; name: string }[];
}

export default function AddTimeCategoryForm({ parentCategory }: AddTimeCategoryFormProps) {
  const [name, setName] = useState("");
  
  async function action(formData: FormData) {
    await createTimeCategory(formData);
    setName(""); // Clear the input after submission
  }
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Add Time Task</h1>
            <form action={action}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                    placeholder="Enter time task name"
                    required
                    
                />
                <select name="parent_category_id" className="ml-4" required>
                    {parentCategory.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button type="submit">Add Time Task</button>
            </form>
        </div>
    );
}