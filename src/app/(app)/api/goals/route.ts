import { createServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
// Don't forget to import your new AI function
import { getGoalPlan } from "@/lib/ai/geminiai"; 

export async function POST(request: Request) {
   const { goalId } = await request.json();
   const supabase = createServer();
   const { data: { user }, error: authError } = await supabase.auth.getUser();
   
   if (authError || !user) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   // 1. Fetch the goal AND its sub-tasks
   const {data: goalData, error} = await supabase
    .from('goals')
    .select('title, priority, parent_categories(name), sub_tasks(title, is_completed)')
    .eq('id', goalId)
    .eq('user_id', user.id)
    .single();

   if (error) {
       return NextResponse.json({ error: error.message }, { status: 400 });
   }

    const goalDataForAI = {
        goalTitle: goalData.title,
        completedTasks: goalData.sub_tasks
        .filter(task => task.is_completed)
        .map(task => task.title),
        incompleteTasks: goalData.sub_tasks
        .filter(task => !task.is_completed)
        .map(task => task.title),
    };
    // Now, stringify the *simple* object
    const goalDataString = JSON.stringify(goalDataForAI);

   // 3. TODO: Call your new AI function
   const aiPlan = await getGoalPlan(goalDataString);
    console.log('AI Plan:', aiPlan);
   return NextResponse.json(aiPlan);
}
