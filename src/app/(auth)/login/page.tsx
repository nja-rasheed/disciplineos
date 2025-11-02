import LoginForm from '@/components/features/auth/LoginForm'
import { Suspense } from 'react'

// 1. This is now a Server Component (no 'use client')
// 2. It receives 'searchParams' as a prop automatically
export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string | null }
}) {
  return (
    // This div centers the form
    <div className="flex min-h-screen items-center justify-center">
      {/* 3. We wrap the LoginForm in a <Suspense> boundary.
           This is good practice and what Next.js expects.
      */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* 4. We pass the message from the server-side prop 
           down to the client component prop */}
        <LoginForm searchMessage={searchParams.message} />
      </Suspense>
    </div>
  )
}