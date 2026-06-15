"use client";
import { ChevronDown } from "lucide-react";

interface HeaderProfileProps {
  name?: string;
  email?: string;
}

export function HeaderProfile({ name, email }: HeaderProfileProps) {
  const initials =
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  return (
    <div className="relative">
      <button
        className="
          flex items-center gap-1 sm:gap-2 lg:gap-3
          rounded-lg sm:rounded-xl
          px-1.5 sm:px-2 lg:px-2.5 py-1 sm:py-1.5 lg:py-2
          transition-all duration-200 bg-green-50
          hover:bg-green-100
          hover:shadow-sm
        "
      >
        
        <div
          className="
            relative flex items-center justify-center
            rounded-full
            bg-green-950 ring-1 ring-green-500
            font-semibold text-white
            shadow-sm
            w-6 h-6 sm:w-7 sm:h-7 lg:w-9 lg:h-9
            text-xs sm:text-sm lg:text-base
          "
        >
          {initials}
        </div>

       
        <div className="hidden sm:block text-left">
          <p
            className="
              max-w-25 md:max-w-35 lg:max-w-40
              truncate text-xs sm:text-sm lg:text-base
              font-semibold text-gray-900
            "
          >
            {name || "Administrator"}
          </p>
          <p
            className="
              hidden md:block
              max-w30 lg:max-w-40
              truncate text-[10px] sm:text-xs
              text-gray-500
            "
          >
            {email || "admin@power8.com"}
          </p>
        </div>


        <ChevronDown
          className="
            hidden sm:block h-3 w-3 sm:h-4 sm:w-4
            text-gray-500 transition-transform"
        />
      </button>
    </div>
  );
}
