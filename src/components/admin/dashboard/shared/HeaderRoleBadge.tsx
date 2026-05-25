"use client";

import { ShieldCheck } from "lucide-react";

interface Props {
  role?: string;
}

export function HeaderRoleBadge({
  role,
}: Props) {
  return (
    <div
      className="
        hidden items-center
        gap-2 rounded-full
        border border-orange-100
        bg-orange-50 px-3 py-2
        sm:flex
      "
    >
      <ShieldCheck
        className="
          h-4 w-4
          text-orange-600
        "
      />

      <span
        className="
          text-xs font-semibold
          uppercase tracking-wide
          text-orange-700
        "
      >
        {role || "Admin"}
      </span>
    </div>
  );
}