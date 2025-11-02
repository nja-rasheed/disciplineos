import SkeletonCard from '@/components/ui/SkeletonCard'

// This component is a "convention" file in Next.js.
// It is automatically shown as a fallback while the 'page.tsx' is loading.
export default function JournalsLoading() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">My Journals</h1>

      {/* Form placeholder */}
      <div className="mb-8 animate-pulse rounded-lg bg-gray-800 p-6">
        <div className="h-10 w-full rounded bg-gray-700"></div>
      </div>

      {/* List placeholder */}
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}