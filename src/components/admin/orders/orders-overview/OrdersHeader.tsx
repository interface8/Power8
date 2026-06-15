"use client";

export function OrdersHeader() {
  return (
    <div
      className="
        flex flex-col gap-4
        sm:flex-row sm:items-center sm:justify-between
      "
    >
      <div className="flex items-center gap-3 sm:gap-4">
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
