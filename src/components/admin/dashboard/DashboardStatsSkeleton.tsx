export default function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-3xl bg-gray-200"
          />
        ))}
      </div>

      <div className="h-112.5 animate-pulse rounded-3xl bg-gray-200" />
    </div>
  );
}