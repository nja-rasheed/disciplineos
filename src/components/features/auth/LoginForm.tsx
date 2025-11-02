'use client'

// 1. We import 'useState' but NO LONGER need 'useEffect' or 'useSearchParams'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// 2. We define a type for the props we will get from the page
type LoginFormProps = {
  searchMessage: string | null
}

export default function LoginForm({ searchMessage }: LoginFormProps) {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // 3. We use the prop to set the initial state of 'message'
  const [message, setMessage] = useState(searchMessage || '')
  
  const router = useRouter()

  // The rest of your handlers are the same
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setMessage('') // Clear previous messages

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      router.push('/dashboard') // Redirect to dashboard
      router.refresh() // Force a refresh to get new user session
    }
  }

  // 4. The JSX is identical to your old page's return
  return (
    <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
      <h2 className="mb-6 text-center text-3xl font-bold text-white">
        Login
      </h2>
      <form onSubmit={handleSignIn} className="space-y-6">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
        >
          Sign In
        </button>

        {/* Error/Message Display */}
        {message && (
          <p className="text-center text-sm text-red-400">{message}</p>
        )}
      </form>

      {/* Link to Signup */}
      <p className="mt-6 text-center text-sm text-gray-400">
        Need to create an account?{' '}
        <a href="/signup" className="font-medium text-blue-500 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  )
}