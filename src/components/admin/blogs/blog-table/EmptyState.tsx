"use client";

import { FolderOpen } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-gray-100 p-3 mb-3">
        <FolderOpen className="h-6 w-6 text-gray-400" />
      </div>
      <p className="text-gray-500">No blogs found</p>
      <p className="text-sm text-gray-400 mt-1">Create your first blog post</p>
    </div>
  );
}