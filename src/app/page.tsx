import Link from 'next/link'
import Image from 'next/image'
import { createServer } from '@/lib/supabase/server'
import {
  CheckCircle,
  BarChart3,
  BookOpen,
  Target,
  Timer,
} from 'lucide-react'

// This Server Component will fetch the user session
// to conditionally show "Login" or "Go to Dashboard"
export default async function LandingPage() {
  const supabase = createServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const features = [
    {
      name: 'Habit Tracker',
      description: 'Build consistent habits with daily tracking and heatmaps.',
      icon: <CheckCircle className="h-10 w-10 text-green-400" />,
    },
    {
      name: 'Goal & Sub-task Manager',
      description: 'Define your long-term goals and break them into small, actionable steps.',
      icon: <Target className="h-10 w-10 text-blue-400" />,
    },
    {
      name: 'Time Tracker',
      description: 'Log your time against specific categories to see where your day goes.',
      icon: <Timer className="h-10 w-10 text-purple-400" />,
    },
    {
      name: 'Daily Journal',
      description: 'Reflect on your day, track your mood, and get AI-powered insights.',
      icon: <BookOpen className="h-10 w-10 text-yellow-400" />,
    },
    {
      name: 'Analytics Dashboard',
      description:
        'Connect your data to see how your time spent impacts your goal progress.',
      icon: <BarChart3 className="h-10 w-10 text-red-400" />,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      {/* --- Header --- */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/DisciplineOS-logo.png" // Using your app icon
              alt="DisciplineOS Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-xl font-bold">DisciplineOS</span>
          </Link>
          <nav>
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-gray-800"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto max-w-5xl px-4 py-24 text-center sm:py-32">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            The Operating System For Your Discipline
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Stop juggling five different apps.
            Track your habits, goals, time, and journal entries all in one
            place.
          </p>
          <div className="mt-10">
            <Link
              href={user ? '/dashboard' : '/signup'}
              className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-blue-500/30"
            >
              Get Started - It's Free
            </Link>
          </div>
        </section>

        {/* [Image of the main DisciplineOS dashboard user interface] */}

        {/* Feature Section */}
        <section className="container mx-auto max-w-5xl px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              An All-In-One Solution
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              DisciplineOS connects all the pieces of your personal growth.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="transform rounded-xl border border-gray-800 bg-gray-800/50 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-800"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white">
                  {feature.name}
                </h3>
                <p className="mt-2 text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-gray-800">
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <p className="text-center text-sm text-gray-500">
            Built by Rasheed.
          </p>
        </div>
      </footer>
    </div>
  )
}
