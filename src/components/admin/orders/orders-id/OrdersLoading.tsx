export default function OrderDetailsLoading() {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header Skeleton */}
      <div className="mb-4 sm:mb-6 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="h-12 w-12 rounded-xl bg-gray-200" />
              <div className="space-y-2">
                <div className="h-6 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Order Items Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
        <div className="p-4 border-b border-gray-100">
          <div className="h-5 w-32 bg-gray-200 rounded" />
        </div>
        <div className="p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Controls Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gray-200" />
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded mt-1" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-10 w-full bg-gray-200 rounded-xl" />
              <div className="h-10 w-full bg-gray-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}