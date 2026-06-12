"use client";

export function RolesTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Role Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Description</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Permissions</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Users</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Created</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="px-4 py-4"><div className="h-5 w-32 bg-gray-200 rounded" /></td>
              <td className="px-4 py-4"><div className="h-4 w-48 bg-gray-200 rounded" /></td>
              <td className="px-4 py-4"><div className="h-5 w-12 bg-gray-200 rounded" /></td>
              <td className="px-4 py-4"><div className="h-5 w-12 bg-gray-200 rounded" /></td>
              <td className="px-4 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
              <td className="px-4 py-4"><div className="flex gap-2"><div className="h-8 w-8 bg-gray-200 rounded" /><div className="h-8 w-8 bg-gray-200 rounded" /><div className="h-8 w-8 bg-gray-200 rounded" /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}