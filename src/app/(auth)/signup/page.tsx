'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignUpPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState('') // Used for errors or success
  const router = useRouter()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setMessage('') // Clear previous messages

    const { data: userExists, error: rpcError } = await supabase.rpc(
        'user_exists',
        {
          email_to_check: email,
        }
      )

      if (rpcError) {
        setMessage(`Error checking user: ${rpcError.message}`)
        return
      }

      // 2. If the RPC returns 'true', show an error and stop.
      if (userExists) {
        setMessage('User with this email already exists. Please log in.')
        return // Stop the function here
      }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      console.log(error);
      setMessage(`Error: ${error.message}`)
    } else {
      // Don't set a message here, just redirect.
      // We'll show the message on the login page.
      router.push('/login?message=Check email to confirm signup')
    }
  }

  return (
    // Main container: full screen, flexbox, centered vertically and horizontally
    <div className="flex min-h-screen items-center justify-center">
      {/* Form container: set width, background, shadow, and padding */}
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-white">
          Create Your Account
        </h2>
        <form onSubmit={handleSignUp} className="space-y-6">
          {/* Full Name Field */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Your Name"
            />
          </div>

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
            Create Account
          </button>

          {/* Error Message */}
          {message && (
            <p className="text-center text-sm text-red-400">{message}</p>
          )}
        </form>

        {/* Link to Login */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}