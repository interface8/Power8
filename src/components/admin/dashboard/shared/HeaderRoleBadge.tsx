"use client";

import { ShieldCheck } from "lucide-react";

interface Props {
  role?: string;
}

export function HeaderRoleBadge({ role }: Props) {
  return (
    <div
      className="
        hidden sm:flex items-center gap-1 sm:gap-2
        rounded-full border border-orange-100
        bg-orange-50 px-2 sm:px-3 py-1 sm:py-2
      "
    >
      <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-orange-700">
        {role || "Admin"}
      </span>
    </div>
  );
}