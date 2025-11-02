import { createServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppShell from '@/components/layout/AppShell' // Import our new shell

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // --- THIS IS THE FIX ---
  // The AppShell component renders the Sidebar and Navbar internally.
  // We just need to render the AppShell and pass the page (children) to it.
  return <AppShell>{children}</AppShell>
}