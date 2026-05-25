"use client";

import { ChevronDown } from "lucide-react";

interface Props {
  name?: string;
}

export function HeaderProfile({
  name,
}: Props) {
  const initials =
    name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  return (
    <button
      className="
        group flex items-center
        gap-3 rounded-2xl
        border border-transparent
        bg-white px-2 py-1.5
        transition-all duration-200
        hover:border-gray-200
        hover:bg-gray-50
      "
    >
      {/* Avatar */}
      <div
        className="
          relative flex
          h-11 w-11 items-center
          justify-center rounded-2xl
          bg-linear-to-br
          from-orange-500
          to-orange-600
          text-sm font-bold
          text-white shadow-lg
          shadow-orange-100
        "
      >
        {initials}

        <span
          className="
            absolute bottom-0
            right-0 h-3 w-3
            rounded-full border-2
            border-white bg-green-500
          "
        />
      </div>

      {/* Info */}
      <div
        className="
          hidden text-left
          sm:block
        "
      >
        <p
          className="
            max-w-32 truncate
            text-sm font-semibold
            text-gray-900
          "
        >
          {name || "Administrator"}
        </p>

        <p
          className="
            text-xs text-gray-500
          "
        >
          System Administrator
        </p>
      </div>

      <ChevronDown
        className="
          hidden h-4 w-4
          text-gray-400
          transition-transform
          group-hover:rotate-180
          sm:block
        "
      />
    </button>
  );
}