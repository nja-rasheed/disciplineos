import {createServer} from '@/lib/supabase/server'
import {redirect} from 'next/navigation'
import AddGoalForm from '@/components/features/goals/AddGoalForm'
import AddSubTaskForm from '@/components/features/goals/AddSubTaskForm';
import SubTaskItem from '@/components/features/goals/SubTaskItem';
import GoalPercentagePage from '@/components/features/goals/Percentage';
import GoalItem from '@/components/features/goals/GoalItem';

export default async function GoalsPage() {
  const supabase = createServer();
  const {data: {user}} = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const {data: goals, error} = await supabase.from('goals')
    .select('*, sub_tasks(*), parent_categories(name)')
    .eq('user_id', user.id)
    .order('created_at', {ascending: false});

  if (error) {
    console.error('Error fetching goals:', error);
  }

  const {data: parentCategories, error: parentError} = await supabase
    .from('parent_categories')
    .select('id, name')
    .order('name', {ascending: true});
  if (parentError) {
    console.error('Error fetching parent categories:', parentError);
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">My Goals</h1>
      <AddGoalForm parentCategories={parentCategories} />
      {goals && goals.length > 0 ? (
        <ul className="space-y-4">
          {goals.map((goal) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              parentCategories={parentCategories || []} // Pass the list for the *edit* form
            />
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No goals found.</p>
      )}
    </div>
  )
}