"use client";

import { Menu } from "lucide-react";

interface Props {
  setOpen: (open: boolean) => void;
}

export function MobileMenuButton({
  setOpen,
}: Props) {
  return (
    <button
      onClick={() => setOpen(true)}
      className="
        flex h-11 w-11
        items-center justify-center
        rounded-2xl border
        border-gray-200 bg-white
        transition-all duration-200
        hover:border-orange-200
        hover:bg-orange-50
        hover:text-orange-600
        lg:hidden
      "
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}