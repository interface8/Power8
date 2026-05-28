"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  label?: string;
}

export function BackButton({ href, label = "Back to Orders" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:text-orange-500"
    >
      <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      <span>{label}</span>
    </Link>
  );
}