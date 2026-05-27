"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

// Helper to format order ID - extracts ORD-XXXX pattern or creates a readable ID
const formatOrderId = (orderId: string) => {
  if (orderId.includes("ORD-")) return orderId;

  // If it's a long database ID (like cmpfslb9u0002icynjwjol5ao)
  // Extract a readable format or use a generic pattern
  if (orderId.length > 10) {
    const ordMatch = orderId.match(/ORD[_-]?\d+/i);
    if (ordMatch) return ordMatch[0].toUpperCase();
    return `ORD-${orderId.slice(-3).toUpperCase()}`;
  }

  return orderId;
};

export function HeaderBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isDashboard = pathname === "/admin/dashboard";
  const isOrders = pathname === "/admin/orders";
  const isOrderDetails =
    pathname.startsWith("/admin/orders/") && pathname !== "/admin/orders";
  const rawOrderId = isOrderDetails ? segments[2] : null;
  const displayOrderId = rawOrderId ? formatOrderId(rawOrderId) : null;

  return (
    <div className="min-w-0">
      {/* Admin Panel Label */}
      <p className="hidden text-xs font-medium uppercase tracking-[0.2em] text-gray-400 sm:block">
        Admin Panel
      </p>

      <div className="mt-0.5 flex min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {/* Dashboard View */}
        {isDashboard ? (
          <h1 className="text-sm sm:text-lg font-semibold text-gray-900">
            Dashboard
          </h1>
        ) : (
          <>
            {/* Dashboard Link  */}
            <Link
              href="/admin/dashboard"
              className="text-sm sm:text-base font-medium text-gray-500 transition-colors hover:text-orange-600"
            >
              Dashboard
            </Link>

            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" />

            {/* Orders Section */}
            {isOrders ? (
              <span className="text-xs sm:text-base font-semibold text-gray-900">
                Orders
              </span>
            ) : isOrderDetails ? (
              <>
                {/* Orders Link */}
                <Link
                  href="/admin/orders"
                  className="text-sm sm:text-base font-medium text-gray-500 transition-colors hover:text-orange-600"
                >
                  Orders
                </Link>

                {/* Chevron */}
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" />

                {/* Order ID */}
                <span className="text-sm sm:text-base font-semibold text-gray-900">
                  {displayOrderId}
                </span>
              </>
            ) : (
              segments.slice(1).map((segment, index, arr) => {
                const href = "/" + segments.slice(0, index + 2).join("/");
                const isLast = index === arr.length - 1;

                return (
                  <div key={segment} className="flex items-center gap-1">
                    {index > 0 && (
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" />
                    )}
                    <Link
                      href={href}
                      className={`
                        capitalize text-sm sm:text-base transition-colors
                        ${
                          isLast
                            ? "font-semibold text-gray-900"
                            : "font-medium text-gray-500 hover:text-orange-600"
                        }
                      `}
                    >
                      {segment.replace(/-/g, " ")}
                    </Link>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}
