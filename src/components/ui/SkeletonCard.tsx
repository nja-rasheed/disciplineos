export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg bg-gray-800 p-4 shadow">
      {/* Mimic a title */}
      <div className="mb-3 h-6 w-3/4 rounded bg-gray-700"></div>
      {/* Mimic some content */}
      <div className="h-4 w-1/2 rounded bg-gray-700"></div>
    </div>
  )
}