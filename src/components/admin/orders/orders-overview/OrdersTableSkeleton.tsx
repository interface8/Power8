"use client";

export default function OrdersTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-275">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              {Array.from({ length: 9 }).map((_, i) => (
                <th key={i} className="px-4 py-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                {Array.from({ length: 9 }).map((_, j) => (
                  <td key={j} className="px-4 py-5">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
