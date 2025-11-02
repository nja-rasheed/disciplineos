import { createServer } from '@/lib/supabase/server'; // <-- Use your existing helper
import { getFeedback } from '@/lib/ai/geminiai';
import { NextResponse } from 'next/server';
// We no longer need 'cookies' or 'createServerClient' from '@supabase/ssr'

export async function POST(req: Request) {
  // 1. Create the client using your simple helper. This is correct.
  const supabase = createServer();

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Journal entry ID is required.' }, { status: 400 });
    }

    // 2. Get the user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Securely fetch the journal entry content
    const { data: journalEntry, error: dbError } = await supabase
      .from('journal_entries')
      .select('content')
      .eq('id', id)
      .eq('user_id', user.id) // This ensures a user can only analyze THEIR OWN entry
      .single();

    if (dbError) {
      console.error('Supabase error:', dbError.message);
      return NextResponse.json({ error: 'Journal entry not found or database error.' }, { status: 404 });
    }

    if (!journalEntry.content) {
      return NextResponse.json({ error: 'Journal entry is empty.' }, { status: 400 });
    }

    // 4. Call the AI service
    // getFeedback now returns the object { mood, experience } or throws an error
    const aiResult = await getFeedback(journalEntry.content);

    // 5. Send the successful result back to the client
    return NextResponse.json({ result: aiResult });

  } catch (error) {
    // 6. Catch any errors (from getFeedback or elsewhere)
    console.error('Error in /api/journal:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message || 'An unknown error occurred.' }, { status: 500 });
  }
}

