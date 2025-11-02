import Link from 'next/link'
import { createServer } from '@/lib/supabase/server';
import Image from 'next/image';

export default async function LandingPage() {
  const supabase = createServer();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">

        <Image
          src="/DisciplineOS-logo.png" // This is the path to your file in the 'public' folder
          alt="DisciplineOS Logo"
          width={500} // Set the desired width (in pixels)
          height={500} // Set the desired height (in pixels)
          priority // Tells Next.js to load this image first (good for logos)
          className="mx-auto mb-6" // Center it and add margin
        />

      <h1 className="text-5xl font-bold text-white">
        Welcome to DisciplineOS
      </h1>
      <p className="mt-4 text-lg text-gray-300">
        Your all-in-one self-improvement application.
      </p>

      {user ? (
        <div>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-lg bg-gray-600 px-5 py-3 font-semibold text-white transition hover:bg-gray-900 hover:scale-105"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-gray-600 px-5 py-3 font-semibold text-white transition hover:bg-gray-900"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-gray-600 px-5 py-3 font-semibold text-white transition hover:bg-gray-900"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
