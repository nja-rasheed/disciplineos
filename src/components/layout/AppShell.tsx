'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  // State to manage the mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <div className="flex flex-1 flex-col">
        {/* Top Navbar */}
        <Navbar onToggle={toggleSidebar} />

        {/* Main Page Content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}