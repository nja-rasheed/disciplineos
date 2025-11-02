'use client'

// --- Define the types for the props ---
type Habit = {
  id: number
  name: string
}

type Completion = {
  habit_id: number
  completed_at: string // YYYY-MM-DD format
}

type HabitHeatmapProps = {
  habits: Habit[]
  completions: Completion[]
}
// ------------------------------------

export default function HabitHeatmap({ habits, completions }: HabitHeatmapProps) {
  // --- Create a Set for faster completion lookups ---
  // Store completions like: "habitId-YYYY-MM-DD" -> true
  const completionSet = new Set(
    completions.map((c) => `${c.habit_id}-${c.completed_at}`)
  )
  // ------------------------------------------------

  // --- Generate the last 30 days ---
  const dates: string[] = []
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0]) // Get YYYY-MM-DD
  }
  dates.reverse() // Put oldest date first
  // ---------------------------------

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed border-collapse border border-gray-700">
        <thead>
          <tr className="bg-gray-700">
            <th className="w-1/4 border border-gray-600 px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
              Habit
            </th>
            {/* Render date headers */}
            {dates.map((date) => (
              <th
                key={date}
                className="border border-gray-600 px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-300"
                title={date} // Show full date on hover
              >
                {/* Show just the day number */}
                {new Date(date + 'T00:00:00').getDate()} 
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700 bg-gray-800">
          {/* Loop through each habit */}
          {habits.map((habit) => (
            <tr key={habit.id}>
              <td className="whitespace-nowrap border border-gray-600 px-2 py-2 text-sm font-medium text-white">
                {habit.name}
              </td>
              {/* Loop through each date for this habit */}
              {dates.map((date) => {
                
                // --- YOUR LOGIC HERE ---
                // 1. Check if this habit was completed on this date.
                //    Use the `completionSet` you created above.
                //    The key in the set looks like: `${habit.id}-${date}`
                const isCompleted = completionSet.has(`${habit.id}-${date}`);
                // -----------------------

                return (
                  <td
                    key={`${habit.id}-${date}`}
                    className={`border border-gray-600 text-center ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-700'
                    }`}
                    title={`${habit.name} - ${date} - ${isCompleted ? 'Completed' : 'Not Completed'}`}
                  >
                    {/* Optionally, add a small visual indicator */}
                    {isCompleted ? '✓' : ''}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}