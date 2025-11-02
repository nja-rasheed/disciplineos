import { createServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AddHabitForm from '@/components/features/habits/AddHabitForm'
import HabitItem from '@/components/features/habits/HabitItem'

// This page is a Server Component, so we can fetch data directly.
export default async function HabitsPage() {
  const supabase = createServer()
  const today = new Date().toISOString().split('T')[0]

  // Check for a user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch the user's habits
  const { data: habits, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id) // Only get habits for this user
    .order('created_at', { ascending: false }) // Show newest first

  if (error) {
    console.error('Error fetching habits:', error)
  }
    const { data: completions } = await supabase
    .from('habit_completions')
    .select('habit_id') // We only need the ID
    .eq('user_id', user.id)
    .eq('completed_at', today)

    const completedHabitIds = new Set(
        completions?.map((comp) => comp.habit_id)
    )

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">My Habits</h1>

      {/* We will add an "Add Habit" form here soon */}

      {/* Habit List */}
        <div className="space-y-4">
        {habits && habits.length > 0 ? (
            // 2. Replace the old map
            habits.map((habit) => {
            const isCompleted = completedHabitIds.has(habit.id)
            
            // Pass the data down as props
            return (
                <HabitItem
                key={habit.id}
                habit={habit}
                isCompleted={isCompleted}
                />
            )
            })
        ) : (
            <p className="text-gray-400">
            You haven't created any habits yet. Let's add one!
            </p>
        )}
        <AddHabitForm />
        </div>
      </div>
  )
}