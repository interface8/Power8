export default function CreditDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-gray-100"
          />
        ))}
      </div>

      <div className="h-56 animate-pulse rounded-2xl bg-gray-100" />

      <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
    </div>
  );
}
