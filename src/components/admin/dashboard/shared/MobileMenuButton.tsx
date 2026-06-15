"use client";

import { Menu } from "lucide-react";

interface Props {
  setOpen: (open: boolean) => void;
}

export function MobileMenuButton({ setOpen }: Props) {
  return (
    <button
      onClick={() => setOpen(true)}
      className="
        flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11
        items-center justify-center
        rounded-xl sm:rounded-2xl
        border border-gray-200 bg-white
        transition-all duration-200
        hover:border-orange-200
        hover:bg-orange-50
        hover:text-orange-600
        lg:hidden
      "
      aria-label="Open menu"
    >
      <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
  );
}
