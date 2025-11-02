import { createServer } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';

export default async function TimeHistoryPage() {
  const supabase = createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: timeSessions, error } = await supabase
    .from('time_sessions')
    // 1. Select the 'id' for a stable key
    .select('id, duration_seconds, start_time, time_categories (name)')
    .eq('user_id', user.id)
    // 2. Add filter: Only show sessions where end_time is NOT null
    .not('end_time', 'is', null)
    .order('start_time', { ascending: false });

  if (error) {
    console.error('Error fetching time sessions:', error);
    // Consider showing an error message on the page
  }

  // Helper function to format seconds into HH:MM:SS or similar
  const formatDuration = (totalSeconds: number | null): string => {
    if (totalSeconds === null || totalSeconds === undefined) return 'N/A';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`); // Show seconds if duration is less than a minute
    return parts.join(' ');
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Time Tracking History</h1>
      {timeSessions && timeSessions.length > 0 ? (
        <div className="space-y-4"> {/* Use a div wrapper for spacing */}
          {timeSessions.map((session) => (
            // Use session.id as the key
            <div key={session.id} className="rounded-lg bg-gray-800 p-4 shadow">
              <p className="font-semibold text-white">
                {/* Add [0] to access the first item in the array */}
                Category: {session.time_categories?.[0]?.name || 'Uncategorized'}
              </p>
              <p className="text-gray-300">
                Duration: {formatDuration(session.duration_seconds)}
              </p>
              {/* Optionally display the date/time */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No completed time sessions found.</p>
      )}
    </div>
  )
}