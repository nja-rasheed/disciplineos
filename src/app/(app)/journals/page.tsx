import { createServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AddJournalForm from "@/components/features/journal/AddJournalForm";
import JournalEntryItem from "@/components/features/journal/JournalItem";

export default async function JournalsPage() {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }
    const { data: journals, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order('entry_date', { ascending: false })
    if (error) {
        console.error("Error fetching journals:", error);
    }

    const today = new Date().toISOString().split('T')[0]
    const todaysEntry =
            journals?.find((entry) => entry.entry_date === today) || null

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">My Journals</h1>
            <AddJournalForm todaysEntry={todaysEntry} />
            {journals && journals.length > 0 ? (
                <ul className="space-y-4">
                    {journals.
                    filter((entry) => entry.entry_date !== today).map((entry) => (
                        <JournalEntryItem key={entry.id} entry={entry} />
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400">No journals found.</p>
            )}
        </div>
    )
}