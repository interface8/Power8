"use client";

const SkeletonRow = () => (
  <tr className="border-b border-gray-100">
    {Array.from({ length: 9 }).map((_, i) => (
      <td key={i} className="px-4 sm:px-6 py-4">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
      </td>
    ))}
   </tr>
);

export default function OrdersTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-200">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {Array.from({ length: 9 }).map((_, i) => (
                <th key={i} className="px-4 sm:px-6 py-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}