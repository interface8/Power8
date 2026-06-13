export function UserDetailSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-6" />

      <div className="bg-white rounded-lg border p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-4">
            <div className="flex items-center">
              <div className="h-14 w-14 sm:h-16 sm:w-16 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-6 sm:h-7 bg-gray-200 rounded w-32 sm:w-48 animate-pulse" />
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-48 sm:w-64 animate-pulse" />
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-16 sm:w-20 animate-pulse" />
            </div>
          </div>
          <div className="h-9 bg-gray-200 rounded w-36 animate-pulse sm:self-start" />
        </div>
        <div className="h-px bg-gray-200 w-full my-4" />
        <div className="h-4 bg-gray-200 rounded w-36 animate-pulse" />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg">
        <div className="overflow-x-auto overflow-y-hidden pb-3 -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex gap-4 sm:gap-8 border-b border-gray-200 min-w-max sm:min-w-0">
            {["Orders", "Solar Systems", "Credit Accounts", "Savings"].map((tab) => (
              <div key={tab} className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
        <div className="mt-6 overflow-x-auto overflow-y-hidden">
          <div className="w-full min-w-137.5 space-y-3">
            <div className="flex w-full pb-3 border-b border-gray-200 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex-1 h-5 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex w-full py-3 gap-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="flex-1 h-5 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}