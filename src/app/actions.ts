'use server' // This is the magic directive!

import { createServer } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'


// This is the function your form will call
export async function createHabit(formData: FormData) {
  // 1. Get the 'name' from the formData object
  const habitName = formData.get('name') as string

  // 2. Create your server-side Supabase client
  const supabase = createServer()

  // 3. Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser()
  // (Don't forget to check if the user exists!)
  if( !user ) {
    throw new Error('User not authenticated')
  }

  // 4. Try to insert the new habit into the 'habits' table
  // Your 'habits' table needs: user_id, name, and frequency_type
  // For now, let's hard-code frequency_type to 'daily'
  //
  const { error } = await supabase.from('habits').insert([
    {
      user_id: user.id,
      name: habitName,
      frequency_type: 'daily' // We'll make this dynamic later
    }
  ])

  // 5. Handle any errors
  if (error) {
    console.error('Error creating habit:', error)
    return
    }

  // 6. IMPORTANT: Revalidate the cache
  // This tells Next.js to re-fetch the data on the '/habits' page
  // so the user sees their new habit instantly.
  revalidatePath('/habits')
}

export async function toggleHabitCompletion(habitId: number) {
  // 1. Get Supabase client and the user
  const supabase = createServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.error('User not found.')
    return
  }

  // 2. Get today's date (as a string in 'YYYY-MM-DD' format)
    const today = new Date().toISOString().split('T')[0]

  // 3. Check if a completion entry already exists for this habit AND this user AND today's date
    const { data: existingCompletion, error: selectError } = await supabase
        .from('habit_completions')
        .select('id')
        .eq('habit_id', habitId)
        .eq('user_id', user.id)
        .eq('completed_at', today)
        .single() // We only expect one, or null)

  // 4. Handle logic:
  //
  // 4a. If an entry exists (existingCompletion is not null), DELETE it.
  if (existingCompletion) {
    await supabase.from('habit_completions').delete().eq('id', existingCompletion.id)
  }
  //
  // 4b. If no entry exists (existingCompletion is null), INSERT one.
    else {
        await supabase.from('habit_completions').insert({
        habit_id: habitId,
        user_id: user.id,
        completed_at: today
        })
    }

  // 5. Revalidate the '/habits' page so the change is visible
  revalidatePath('/habits')
}

export async function createGoal(formData: FormData) {
const goalTitle = formData.get('title') as string
  const parentCategoryIdStr = formData.get('parent_category_id') as string // Keep as string for null check
  const priorityStr = formData.get('priority') as string // Get as string

  // ... (get supabase, user) ...

  // Parse priority to integer
  const priority = parseInt(priorityStr, 10); 
  // Parse parentCategoryId or set to null
  const parentCategoryId = parentCategoryIdStr ? parseInt(parentCategoryIdStr, 10) : null;

  const supabase = createServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase.from('goals').insert([
    {
      user_id: user.id,
      title: goalTitle,
      priority: priority,
      parent_category_id: parentCategoryId
    }
  ])

  if (error) {
    console.error('Error creating goal:', error)
    return
  }

  revalidatePath('/goals')
}

export async function createSubTask(formData: FormData) {
  const subTaskTitle = formData.get('sub_task_title') as string
  const goalId = formData.get('goal_id') as string
  const supabase = createServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }
  const { error } = await supabase.from('sub_tasks').insert([
    {
      user_id: user.id,
      goal_id: goalId,
      title: subTaskTitle
    }
  ])
  if (error) {
    console.error('Error creating sub-task:', error)
    return
  }
  revalidatePath('/goals')
}

export async function toggleSubTaskCompletion(subTaskId: number, isCompleted: boolean) {
  const supabase = createServer()
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('User not found.');
    return;
  }
  const {data, error} = await supabase.from('sub_tasks').update({
    is_completed: !isCompleted
  }).eq('id', subTaskId).eq('user_id', user.id);
  if (error) {
    console.error('Error toggling sub-task completion:', error);
    return;
  }
  revalidatePath('/goals');
}

export async function createJournalEntry(formData: FormData) {
  const today = new Date().toISOString().split('T')[0]
  const content = formData.get('content') as string
  const supabase = createServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase.from('journal_entries').upsert([
    {
      user_id: user.id,
      entry_date: today,
      content: content,
    },
  ]  ,{
      onConflict: 'user_id, entry_date',
    })

  if (error) {
    console.error('Error creating journal entry:', error)
    return
  }

  revalidatePath('/journals')
}

export async function createTimeCategory(formData: FormData) {
  // 1. Get the raw name
  const rawName = formData.get('name') as string
  const parentCategoryId = parseInt(formData.get('parent_category_id') as string, 10)

  // 2. "Clean" the input
  const categoryName = rawName.trim()

  const supabase = createServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase.from('time_categories').insert([
    {
      user_id: user.id,
      name: categoryName,
      parent_category_id: parentCategoryId
    },
  ])

  if (error) {
    console.error('Error creating time category:', error)
    return
  }

  // 4. Revalidate the correct page path
  revalidatePath('/time-tracker')
}

export async function startSession(category_Id: number) {
  const supabase = createServer();
  const {data: { user }} = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase.from("time_sessions").insert([
    {
      user_id: user.id,
      category_id: category_Id,
      start_time: new Date().toISOString(),
    },
  ]).select('id').single();

  if (error) {
    console.error("Error starting time session:", error);
    return;
  }

  return data.id;
}

export async function endSession(sessionId: number) {
  const supabase = createServer();
  const endTime = new Date();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

const { data: session, error: fetchError } = await supabase
    .from('time_sessions')
    .select('start_time')
    .eq('user_id', user.id) // Security check
    .eq('id', sessionId)     // Find the specific session
    .single()

    if (fetchError || !session) {
      console.error('Error fetching session to stop:', fetchError)
      return
    }
    const startTime = new Date(session.start_time);

    const durationInSeconds = Math.round((endTime.getTime() - startTime.getTime()) / 1000)

  const { error } = await supabase.from("time_sessions").update({
      end_time: endTime.toISOString(),
      duration_seconds: durationInSeconds,

    }).eq("id", sessionId).eq("user_id", user.id);


  if (error) {
    console.error("Error ending time session:", error);
    return;
  }

  revalidatePath("/time-tracker");
}
export async function logout() {
  const supabase = createServer();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function deleteTimeCategory(categoryId: number) {
  const supabase = createServer();
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const {error} = await supabase.from("time_categories").delete().eq("id", categoryId). eq("user_id", user.id);
  if(error) {
    console.error("Error deleting time category:", error);
    return { error: `Error deleting time category: ${error.message}` };
  }
  revalidatePath("/time-tracker");
}
export async function updateTimeCategory(formData: FormData) {
  const categoryId = parseInt(formData.get('category_id') as string, 10);
  const rawName = formData.get('name') as string;
  const color = formData.get('color') as string | null;

  const categoryName = rawName.trim();
  const supabase = createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const {error} = await supabase.from("time_categories").update({
    name: categoryName,
    color: color,
  }).eq("id", categoryId).eq("user_id", user.id);

  if (error) {
    console.error('Error updating time category:', error);
    return;
  }
  revalidatePath('/time-tracker');
}

export async function deleteHabit(habitId: number) {
  const supabase = createServer();
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const {error} = await supabase.from("habits").delete().eq("id", habitId). eq("user_id", user.id);
  if(error) {
    console.error("Error deleting habit:", error);
    return { error: `Error deleting habit: ${error.message}` };
  }
  revalidatePath("/habits");
}

export async function updateHabit(formData: FormData) {
  const habitId = parseInt(formData.get('habit_id') as string, 10);
  const rawName = formData.get('name') as string; // Get the raw name
  const habitName = rawName.trim(); // <-- ADD THIS TRIM

  console.log('Updating habit:', { habitId, habitName }); // Debug log
  
  const supabase = createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Add a check for empty name after trimming
  if (!habitName) {
    console.error('Error: Habit name cannot be empty');
    return;
  }
  console.log("User found:", user.id); // Debug log
  
  const {data, error} = await supabase.from("habits").update({
    name: habitName, // Use the trimmed name
  }).eq("id", habitId).eq("user_id", user.id);
  console.log('Update result:', { data, error }); // Debug log
  if (error) {
    console.error('Error updating habit:', error);
    return;
  }
  revalidatePath('/habits');
}

export async function deleteSubTask(subTaskId: number) {
  const supabase = createServer();
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const {error} = await supabase.from("sub_tasks").delete().eq("id", subTaskId).eq("user_id", user.id);
  if(error) {
    console.error("Error deleting sub-task:", error);
    return;
  }
  revalidatePath("/goals");
}

export async function updateSubTask(formData: FormData) {
  const subTaskId = parseInt(formData.get('sub_task_id') as string, 10);
  const rawTitle = formData.get('title') as string;
  const title = rawTitle.trim();

  const supabase = createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase.from("sub_tasks").update({
    title: title,
  }).eq("id", subTaskId).eq("user_id", user.id);

  if (error) {
    console.error('Error updating sub-task:', error);
    return;
  }
  revalidatePath('/goals');
}
export async function deleteGoal(goalId: number) {
  const supabase = createServer();
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const {error} = await supabase.from("goals").delete().eq("id", goalId). eq("user_id", user.id);
  if(error) {
    console.error("Error deleting goal:", error);
    return;
  }
  revalidatePath("/goals");
}
export async function updateGoal(formData: FormData) {
  const goalId = parseInt(formData.get('goal_id') as string, 10);
  const rawTitle = formData.get('title') as string;
  const priorityStr = formData.get('priority') as string;
  
  // 1. GET THE PARENT CATEGORY ID (just like in createGoal)
  const parentCategoryIdStr = formData.get('parent_category_id') as string;

  const title = rawTitle.trim();
  const priority = parseInt(priorityStr, 10);
  const parentCategoryId = parentCategoryIdStr ? parseInt(parentCategoryIdStr, 10) : null;

  const supabase = createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase.from("goals").update({
    title: title,
    priority: priority,
    parent_category_id: parentCategoryId // 2. ADD IT TO THE UPDATE
  }).eq("id", goalId).eq("user_id", user.id);

  if (error) {
    console.error('Error updating goal:', error);
    return;
  }
  revalidatePath('/goals');
}

export async function deleteJournalEntry(entryId: number) {
  const supabase = createServer();
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const {error} = await supabase.from("journal_entries").delete().eq("id", entryId).eq("user_id", user.id);
  if(error) {
    console.error("Error deleting journal entry:", error);
    return;
  }
  revalidatePath("/journal");
}
