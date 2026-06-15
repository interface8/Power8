"use client";

import { Eye, EyeOff } from "lucide-react";

interface StatusBadgeProps {
  isPublished: boolean;
}

export function StatusBadge({ isPublished }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {isPublished ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}