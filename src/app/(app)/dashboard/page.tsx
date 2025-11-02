import { createServer } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import TimeChart from "@/components/features/dashboard/TimeChart"
import HabitHeatMap from "@/components/features/dashboard/HabitHeatMap"
import HabitHeatmap from "@/components/features/dashboard/HabitHeatMap";
import GoalTimeWidget from "@/components/features/dashboard/GoalTimeWidget"
export default async function DashboardPage() {
  const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Inside your async DashboardPage
  const { data: timeAnalytics, error: rpcError } = await supabase
    .rpc('get_time_analytics', {
      // These are the arguments for your SQL function
      p_user_id: user.id, // The user's ID
      p_days: 7          // Let's look at the last 7 days
    })
  if (rpcError) {
    console.error('Error fetching time analytics:', rpcError);
    // Handle the error as needed, e.g., show a message to the user
  }
  
  // ... after your timeAnalytics fetch ...

  // --- 2. HABIT DATA (New!) ---

  // Get all habits
  const { data: habits, error: habitsError } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)

  // Get completions from the last 30 days
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString()

  const { data: completions, error: completionsError } = await supabase
    .from('habit_completions')
    .select('habit_id, completed_at')
    .eq('user_id', user.id)
    .gte('completed_at', thirtyDaysAgo) // gte = "greater than or equal to"

  const { data: goalAnalytics, error: goalRpcError } = await supabase
    .rpc('get_dashboard_analytics', {
      p_user_id: user.id,
    })
  
  if (goalRpcError) {
    console.error('Error fetching goal analytics:', goalRpcError)
  }


  return (
    <div>
      <h1 className="text-3xl font-bold">My Dashboard</h1>
      {timeAnalytics && timeAnalytics.length > 0 ? (
        <TimeChart data={timeAnalytics} />
      ) : (
        <p className="text-gray-400">No time tracked in the last 7 days.</p>
      )}

      {/* NEW Habit Heatmap Widget */}
      <div className="my-4 rounded-lg bg-gray-800 p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">
          Habit Consistency (Last 30 Days)
        </h2>
        
        {/* We will replace this with our component in the next step */}
        <HabitHeatmap
          habits={habits || []}
          completions={completions || []}
        />
      </div>

      <div className="my-4 rounded-lg bg-gray-800 p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Goal vs. Time Analysis</h2>
        {goalAnalytics && goalAnalytics.length > 0 ? (
          <GoalTimeWidget data={goalAnalytics} />
        ) : (
          <p className="text-gray-400">
            No goal or time data found. Link your goals to a category and
            track time to see insights here.
          </p>
        )}
      </div>
    </div>
  )
}