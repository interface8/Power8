"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

// Helper to format order ID - extracts ORD-XXXX pattern or creates a readable ID
const formatOrderId = (orderId: string) => {
  if (!orderId) return "";
  
  // If it already has ORD- pattern, return as is
  if (orderId.includes("ORD-")) return orderId;
  
  // If it's a long database ID (like cmpfslb9u0002icynjwjol5ao)
  if (orderId.length > 10) {
    // Try to find ORD in the string
    const ordMatch = orderId.match(/ORD[_-]?\d+/i);
    if (ordMatch) return ordMatch[0].toUpperCase();
    
    // Take last 6 characters for readability
    const suffix = orderId.slice(-6).toUpperCase();
    return `ORD-${suffix}`;
  }
  
  return orderId;
};

// Helper to format credit account ID
const formatCreditId = (creditId: string) => {
  if (!creditId) return "";
  
  // If it already has CRD- pattern, return as is
  if (creditId.includes("CRD-")) return creditId;
  
  // If it's a long database ID
  if (creditId.length > 10) {
    // Try to find CRD in the string
    const crdMatch = creditId.match(/CRD[_-]?\d+/i);
    if (crdMatch) return crdMatch[0].toUpperCase();
    
    // Take last 6 characters for readability
    const suffix = creditId.slice(-6).toUpperCase();
    return `CRD-${suffix}`;
  }
  
  return creditId;
};

// Generic formatter for any ID type
const formatId = (id: string, type: "order" | "credit"): string => {
  if (type === "order") return formatOrderId(id);
  return formatCreditId(id);
};

export function HeaderBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isDashboard = pathname === "/admin/dashboard";
  const isOrders = pathname === "/admin/orders";
  const isOrderDetails = pathname.startsWith("/admin/orders/") && pathname !== "/admin/orders";
  const isCreditAccounts = pathname === "/admin/credit-accounts";
  const isCreditDetails = pathname.startsWith("/admin/credit-accounts/") && pathname !== "/admin/credit-accounts";
  const isRolePermissions = pathname.includes("/admin/roles/") && pathname.includes("/permissions");
  
  // Get the ID from the path for order/credit details
  const rawId = isOrderDetails ? segments[2] : isCreditDetails ? segments[2] : null;
  const idType = isOrderDetails ? "order" : isCreditDetails ? "credit" : null;
  const displayId = rawId && idType ? formatId(rawId, idType) : null;

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
            {/* Dashboard Link */}
            <Link
              href="/admin/dashboard"
              className="text-sm sm:text-base font-medium text-gray-500 transition-colors hover:text-orange-600"
            >
              Dashboard
            </Link>

            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" />

            {/* Orders Section */}
            {isOrders && (
              <span className="text-sm sm:text-base font-semibold text-gray-900">
                Orders
              </span>
            )}

            {/* Credit Accounts Section */}
            {isCreditAccounts && (
              <span className="text-sm sm:text-base font-semibold text-gray-900">
                Credit Accounts
              </span>
            )}

            {/* Order Details Section */}
            {isOrderDetails && (
              <>
                <Link
                  href="/admin/orders"
                  className="text-sm sm:text-base font-medium text-gray-500 transition-colors hover:text-orange-600"
                >
                  Orders
                </Link>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" />
                <span className="text-sm sm:text-base font-semibold text-gray-900">
                  {displayId}
                </span>
              </>
            )}

            {/* Credit Details Section */}
            {isCreditDetails && (
              <>
                <Link
                  href="/admin/credit-accounts"
                  className="text-sm sm:text-base font-medium text-gray-500 transition-colors hover:text-orange-600"
                >
                  Credit Accounts
                </Link>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" />
                <span className="text-sm sm:text-base font-semibold text-gray-900">
                  {displayId}
                </span>
              </>
            )}

            {/* Role Permissions Section - Show "Manage Permissions" instead of role ID */}
            {isRolePermissions && (
              <>
                <Link
                  href="/admin/roles"
                  className="text-sm sm:text-base font-medium text-gray-500 transition-colors hover:text-orange-600"
                >
                  Roles
                </Link>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" />
                <span className="text-sm sm:text-base font-semibold text-gray-900">
                  Manage Permissions
                </span>
              </>
            )}

            {/* Other segments (categories, products, etc.) */}
            {!isOrders && !isCreditAccounts && !isOrderDetails && !isCreditDetails && !isRolePermissions && (
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