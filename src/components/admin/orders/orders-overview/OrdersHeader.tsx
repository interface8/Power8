"use client";

import { PackageSearch } from "lucide-react";

export function OrdersHeader() {
  return (
    <div
      className="
        flex flex-col gap-4
        sm:flex-row sm:items-center sm:justify-between
      "
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Icon */}
        <div
          className="
            flex h-11 w-11 shrink-0 items-center justify-center
            rounded-2xl
            bg-linear-to-br from-orange-100 to-orange-50
            shadow-sm ring-1 ring-orange-100

            sm:h-12 sm:w-12
            lg:h-14 lg:w-14
          "
        >
          <PackageSearch
            className="
              h-5 w-5 text-orange-600
              sm:h-5 sm:w-5
              lg:h-6 lg:w-6
            "
          />
        </div>

        {/* Text */}
        <div className="min-w-0">
          <h1
            className="
              text-lg font-bold tracking-tight text-gray-900
              sm:text-xl
              md:text-2xl
              lg:text-3xl
            "
          >
            Orders Management
          </h1>

          <p
            className="
              mt-1 max-w-xl
              text-xs text-gray-500
              sm:text-sm
              md:text-base
            "
          >
            View and manage customer orders efficiently
          </p>
        </div>
      </div>
    </div>
  );
}
