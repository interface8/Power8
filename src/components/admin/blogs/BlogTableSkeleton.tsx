"use client";

export function BlogTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-200">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Title</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Category</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Author</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="animate-pulse">
              {/* Title Column */}
              <td className="px-4 py-3">
                <div className="space-y-1">
                  <div className="h-4 w-48 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
               </td>
              
              {/* Category Column */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-3.5 w-3.5 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
               </td>
              
              {/* Author Column */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-3.5 w-3.5 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
               </td>
              
              {/* Status Column */}
              <td className="px-4 py-3">
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
               </td>
              
              {/* Date Column */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-3.5 w-3.5 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
               </td>
              
              {/* Actions Column */}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                  <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                  <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                </div>
               </td>
             </tr>
          ))}
        </tbody>
       </table>
    </div>
  );
}