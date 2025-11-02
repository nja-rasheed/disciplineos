import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServer() {
  // We do NOT call cookies() here anymore.

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // We now call cookies() inside each method.
        // This ensures it runs in the correct server context.
        async get(name: string) {
          const cookieStore = await cookies() // Call cookies() here
          // `cookieStore` can be different shapes depending on runtime (readonly vs writable).
          // Accessing `get` is safe on the readonly cookies object.
          return (cookieStore as any).get?.(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            // In some server contexts the returned cookies object is readonly.
            // Cast to `any` to call `set` when available and swallow otherwise.
            const cookieStore: any = await cookies() // Call cookies() here
            cookieStore.set?.({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This is not allowed, as Server Components are read-only.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const cookieStore: any = await cookies() // Call cookies() here
            // Prefer delete when available, fall back to setting an empty value.
            if (typeof cookieStore.delete === 'function') {
              cookieStore.delete(name, options)
            } else {
              cookieStore.set?.({ name, value: '', ...options })
            }
          } catch (error) {
            // The `delete`/`set` method was called from a Server Component.
            // This is not allowed, as Server Components are read-only.
          }
        },
      },
    }
  )
}