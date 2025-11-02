'use client'

type NavbarProps = {
  onToggle: () => void
}

export default function Navbar({ onToggle }: NavbarProps) {
  return (
    // This bar is only visible on mobile (hidden on medium screens and up)
    <nav className="sticky top-0 z-10 flex h-16 w-full items-center bg-gray-800 p-4 shadow-md md:hidden">
      <button
        onClick={onToggle}
        className="rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white"
        aria-label="Toggle menu"
      >
        {/* Hamburger Icon */}
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div className="ml-4 text-xl font-bold text-white">DisciplineOS</div>
    </nav>
  )
}