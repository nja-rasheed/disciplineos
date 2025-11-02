'use client'
export const dynamic = 'force-dynamic'

// ... all your imports
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignInPage() {
    const supabase = createClient()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('') // Used for errors or success
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const msg = searchParams.get('message')
        if (msg) {
            setMessage(msg)
        }
    }, [searchParams])

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
      router.push('/dashboard')
    }
  }

  return (
    // Main container: full screen, flexbox, centered vertically and horizontally
    <div className="flex min-h-screen items-center justify-center">
      {/* Form container: set width, background, shadow, and padding */}
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
            Login
          </button>

          {/* Error Message */}
          {message && (
            <p className="text-center text-sm text-red-400">{message}</p>
          )}
        </form>

        {/* Link to Login */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Need to Create an account?{' '}
          <a href="/signup" className="font-medium text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}