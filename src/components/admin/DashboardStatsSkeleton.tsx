export default function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-3 w-24 bg-gray-200 rounded" />

              <div className="h-7 w-32 bg-gray-300 rounded" />
            </div>

            <div className="w-12 h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
