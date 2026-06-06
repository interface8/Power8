export default function CreditAccountsTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-237.5">
        <div className="grid grid-cols-6 gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-4 animate-pulse rounded bg-gray-200"
            />
          ))}
        </div>

        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-6 gap-4 border-b border-gray-100 px-6 py-5"
          >
            {Array.from({ length: 6 }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-5 animate-pulse rounded bg-gray-100"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}