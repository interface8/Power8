export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-2xl bg-gray-200 animate-pulse"
          />
        ))}
      </div>

      <div className="h-100 rounded-2xl bg-gray-200 animate-pulse" />
    </div>
  );
}
