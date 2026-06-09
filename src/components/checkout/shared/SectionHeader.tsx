"use client";

import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function SectionHeader({
  title,
  description,
  icon: Icon,
}: SectionHeaderProps) {
  return (
    <div
      className="
        flex items-start gap-4
        border-b border-gray-100
        bg-linear-to-r
        from-green-50/70
        to-white
        px-5 py-5
        sm:px-6
      "
    >
      <div
        className="
          flex h-11 w-11 shrink-0
          items-center justify-center
          rounded-2xl bg-green-100
        "
      >
        <Icon className="h-5 w-5 text-green-700" />
      </div>

      <div className="min-w-0">
        <h2
          className="
            text-base font-semibold
            text-green-950
            sm:text-lg
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1 text-sm
            text-gray-500
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}