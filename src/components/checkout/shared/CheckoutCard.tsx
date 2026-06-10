"use client";

import { ReactNode } from "react";

import { cn } from "@/components/ui/utils";

interface CheckoutCardProps {
  children: ReactNode;
  className?: string;
}

export function CheckoutCard({ children, className }: CheckoutCardProps) {
  return (
    <div
      className={cn(
        `
          rounded-3xl border border-gray-200
          bg-white shadow-sm
          transition-all duration-300
        `,
        className,
      )}
    >
      {children}
    </div>
  );
}
