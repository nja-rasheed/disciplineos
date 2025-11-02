import { createServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppShell from '@/components/layout/AppShell' // Import our shell
import Sidebar from '@/components/layout/Sidebar'

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

  // Pass the children into the AppShell
  // This layout correctly wraps ONLY your protected app pages
  return <AppShell sidebar={<Sidebar />}>{children}</AppShell>
}