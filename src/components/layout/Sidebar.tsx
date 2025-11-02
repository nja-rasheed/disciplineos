'use client'

import Link from 'next/link'
import { logout } from '@/app/actions'
import { usePathname } from 'next/navigation' // Hook to get current URL

type SidebarProps = {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname() // Get the current path

  // Helper function to conditionally apply styles for the active link
  const getLinkClasses = (path: string) => {
    return `
      block rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white
      ${pathname === path ? 'bg-gray-900 text-white' : ''}
    `
  }

  return (
    <>
      {/* 1. Mobile Overlay (dimmed background) */}
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={onToggle}
      ></div>

      {/* 2. The Sidebar itself */}
      <nav
        className={`
          fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-800 p-6 shadow-lg
          transition-transform duration-300 ease-in-out md:static md:z-auto md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo/Title */}
        <div className="mb-8 text-2xl font-bold text-white">DisciplineOS</div>

        {/* Navigation Links */}
        <ul className="flex-grow space-y-2">
          <li>
            <Link
              href="/dashboard"
              className={getLinkClasses('/dashboard')}
              onClick={onToggle} // Close menu on mobile nav click
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/habits"
              className={getLinkClasses('/habits')}
              onClick={onToggle}
            >
              Habits
            </Link>
          </li>
          <li>
            <Link
              href="/goals"
              className={getLinkClasses('/goals')}
              onClick={onToggle}
            >
              Goals
            </Link>
          </li>
          <li>
            <Link
              href="/journals"
              className={getLinkClasses('/journal')}
              onClick={onToggle}
            >
              Journal
            </Link>
          </li>
          <li>
            <Link
              href="/time-tracker"
              className={getLinkClasses('/time-tracker')}
              onClick={onToggle}
            >
              Time Tracker
            </Link>
          </li>
        </ul>

        {/* Logout Button (at the bottom) */}
        <div className="mt-auto pt-4">
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-md bg-red-600 p-2 text-left font-semibold text-white hover:bg-red-700"
            >
              Logout
            </button>
          </form>
        </div>
      </nav>
    </>
  )
}