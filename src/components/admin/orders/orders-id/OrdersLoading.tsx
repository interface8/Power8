export default function OrderDetailsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Skeleton */}
        <div className="mb-4 sm:mb-6">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200 mb-4" />
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-gray-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 w-48 sm:w-64 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <div className="h-10 w-20 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-10 w-20 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Skeleton */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Order Items Skeleton */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gray-200 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Controls Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gray-200 animate-pulse" />
                <div>
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mt-1" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
