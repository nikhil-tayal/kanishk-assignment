export default function PostLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-8 w-20 bg-gray-100 rounded-lg" />
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-8 bg-gray-200 rounded w-full" />
        <div className="h-8 bg-gray-200 rounded w-4/5" />
      </div>
      <div className="flex gap-3 mb-8">
        <div className="h-4 w-24 bg-gray-100 rounded" />
        <div className="h-4 w-4 bg-gray-100 rounded" />
        <div className="h-4 w-32 bg-gray-100 rounded" />
      </div>
      <div className="h-64 bg-gray-100 rounded-2xl mb-8" />
      <div className="bg-gray-50 rounded-xl p-5 mb-8 space-y-2">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded w-full" />
        ))}
      </div>
    </div>
  )
}
