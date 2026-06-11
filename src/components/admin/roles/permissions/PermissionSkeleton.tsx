"use client";

export function PermissionSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div><div className="h-8 w-48 bg-gray-200 rounded mb-2" /><div className="h-4 w-96 bg-gray-200 rounded" /></div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3 mb-4"><div className="h-8 w-8 bg-gray-200 rounded-lg" /><div className="flex-1"><div className="h-5 w-32 bg-gray-200 rounded mb-1" /><div className="h-3 w-20 bg-gray-200 rounded" /></div></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, j) => (<div key={j} className="h-10 bg-gray-100 rounded" />))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}