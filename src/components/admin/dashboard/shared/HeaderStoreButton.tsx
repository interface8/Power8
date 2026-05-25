"use client";

import Link from "next/link";

import { ExternalLink } from "lucide-react";

export function HeaderStoreButton() {
  return (
    <Link
      href="/products"
      target="_blank"
      className="
        hidden items-center
        gap-2 rounded-2xl
        border border-gray-200
        bg-white px-4 py-2.5
        text-sm font-medium
        text-gray-600
        transition-all duration-200
        hover:border-orange-200
        hover:bg-orange-50
        hover:text-orange-600
        md:flex
      "
    >
      <ExternalLink className="h-4 w-4" />

      <span>View Store</span>
    </Link>
  );
}