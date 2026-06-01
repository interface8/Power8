"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function HeaderStoreButton() {
  return (
    <>
      {/* Mobile: Icon only */}
      <Link
        href="/products"
        target="_blank"
        className="
          flex items-center justify-center
          rounded-xl 
          bg-white p-2
          text-gray-600
          transition-all duration-200
          hover:border-orange-200
          hover:bg-orange-50
          hover:text-orange-600
          md:hidden
        "
        aria-label="View store"
      >
        <ExternalLink className="h-4 w-4" />
      </Link>

      {/* Desktop: Full button */}
      <Link
        href="/products"
        target="_blank"
        className="
          hidden md:flex items-center gap-2
          rounded-2xl
          bg-white px-3 sm:px-4 py-1.5 sm:py-2.5
          text-xs sm:text-sm
          text-gray-600
          transition-all duration-200
          hover:border-orange-200
          hover:bg-orange-50
          hover:text-orange-600
        "
      >
        <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span>View Store</span>
      </Link>
    </>
  );
}
