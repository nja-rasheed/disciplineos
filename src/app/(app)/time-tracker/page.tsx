import { createServer } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import AddTimeCategoryForm from "@/components/features/timetracker/AddTimeCategoryForm";
import Timer from "@/components/features/timetracker/Timer"; // Make sure path is correct
import Link from "next/link";
import CategoryItem from "@/components/features/timetracker/CategoryItem";

export default async function TimeTrackerPage() { // Renamed for clarity
  const supabase = createServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Fetch only the categories needed for the Timer and Category list
  const { data: timeCategories, error } = await supabase
    .from("time_categories")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true }); // Order alphabetically

  if (error) {
    console.error("Error fetching time categories:", error);
    // Optionally return an error message component
  }
  const {data: parentCategories, error: parentError } = await supabase
    .from("parent_categories")
    .select("id, name")
    .order("name", { ascending: true });
  if (parentError) {
    console.error("Error fetching parent categories:", parentError);
  }
  // NOTE: We are NOT fetching time_sessions here anymore.
  // That belongs in a separate session history view.

  return (
    <div>
    <div className="mb-6 flex items-center justify-between"> {/* Flex container */}
        <h1 className="text-3xl font-bold">Time Tracker</h1>

        {/* Add this Link, styled as a button */}
        <Link 
          href="/time-tracker/history" 
          className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
        >
          View History
        </Link>
      </div>


      {/* The main timer component */}
      <Timer categories={timeCategories || []} />

      {/* Category Management Section */}
      <div className="mt-8">
        <AddTimeCategoryForm parentCategory={parentCategories}/>

        <h2 className="mb-4 mt-6 text-2xl font-bold">Your Categories</h2>
        <ul className="space-y-2">
          {timeCategories && timeCategories.length > 0 ? (
            timeCategories.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))
          ) : (
            <li className="rounded-lg bg-gray-800 p-4 shadow">
              <p className="text-gray-400">No time categories found.</p>
              <p className="text-sm text-gray-500">Default categories (Work, Study, Exercise) will be added automatically for new users.</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}