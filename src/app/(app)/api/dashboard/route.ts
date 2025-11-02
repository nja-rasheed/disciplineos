import { createServer } from '@/lib/supabase/server';
import { getGoalFeedback } from '@/lib/ai/geminiai'; // Use the function we just built
import { NextResponse } from 'next/server';

// This function will be called by your <AiAnalytics> component's fetch
export async function GET() {
  try {
    const supabase = createServer();

    // 1. Get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch the raw analytics data from our SQL function
    const { data: analytics, error: rpcError } = await supabase
      .rpc('get_dashboard_analytics', {
        p_user_id: user.id,
      });

    if (rpcError) {
      throw new Error(`Supabase RPC error: ${rpcError.message}`);
    }

    if (!analytics || analytics.length === 0) {
      return NextResponse.json({ observation: "No data yet.", suggestion: "Track some time against your goals, and I'll provide an analysis here." });
    }

    // 3. Format the data into a simple string for the AI
    const formattedData = analytics.map((item: any) => ({
      category: item.parent_category_name,
      time_spent_hours: parseFloat((item.total_seconds_logged / 3600).toFixed(1)),
      goal_progress_percent: parseFloat(Number(item.average_goal_progress).toFixed(1))
    }));

    const analyticsDataString = JSON.stringify(formattedData);

    // 4. Call the AI
    const aiResult = await getGoalFeedback(analyticsDataString);

    // 5. Send the AI's response (e.g., { observation: "...", suggestion: "..." })
    return NextResponse.json(aiResult);

  } catch (error) {
    console.error('Error in /api/dashboard-analysis:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message || 'An unknown error occurred.' }, { status: 500 });
  }
}