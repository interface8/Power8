"use client";

import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { SystemInfoCard } from "@/components/dashboard/SystemInfoCard";
import { PaymentStatusCard } from "@/components/dashboard/PaymentStatusCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionCard";
import { PaymentProgressCard } from "@/components/dashboard/PaymentProgressCard";
import { UpcomingPaymentsCard } from "@/components/dashboard/UpcomingPaymentCard";
import { useUserSystems } from "@/hooks/use-systems";
import { useAuth } from "@/components/providers/auth-provider";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useOrders } from "@/hooks/use-orders";
import type { OrderDto } from "@/modules/orders/types";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-teal-100 text-teal-700",
  DELIVERED: "bg-teal-100 text-teal-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SolarDashboardPage() {
  const { user } = useAuth();
  const { data: systems = [], isLoading: systemsLoading } = useUserSystems();
  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useOrders();


  const orders: OrderDto[] = Array.isArray(ordersData) ? ordersData : [];
  const recentOrders = orders.slice(0, 3);
  const latestOrder = orders[0];

  const {
    paymentProgress,
    upcomingPayments,
    monthlyPayment,
    nextDueDate,
    isLoading,
  } = useDashboardData();

  const currentSystem = systems[0];

  const products =
    latestOrder?.items?.map((item) => ({
      name: item.productName ?? item.bundleName ?? "Unknown item",
      qty: item.quantity,
    })) ??
    (currentSystem?.bundleName
      ? [{ name: currentSystem.bundleName, qty: 1 }]
      : []);

  const installationAddress = latestOrder?.installationAddress
    ? `${latestOrder.installationAddress}, ${latestOrder.city ?? ""}, ${latestOrder.state ?? ""}`
    : "No installation address yet";

  return (
    <div className="space-y-10 px-4 md:px-0">
      <WelcomeHeader name={user?.name || "User"} />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SystemInfoCard
            systemId={currentSystem?.id || "SYS-001"}
            installDate={
              currentSystem?.createdAt
                ? new Date(currentSystem.createdAt)
                    .toISOString()
                    .split("T")[0]
                : latestOrder?.createdAt
                  ? new Date(latestOrder.createdAt).toISOString().split("T")[0]
                  : "—"
            }
            address={installationAddress}
            products={products}
            systemStatus={currentSystem?.status}
            isLoading={systemsLoading}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <PaymentStatusCard
            paymentData={{
              monthlyPayment: monthlyPayment.toString(),
              nextDueDate,
            }}
            systemStatus={currentSystem?.status}
            isLoading={isLoading}
          />
          <QuickActionsCard />
        </div>
      </div>

      <PaymentProgressCard
        paymentProgress={paymentProgress}
        isLoading={isLoading}
      />

      <UpcomingPaymentsCard
        schedules={upcomingPayments}
        isLoading={isLoading}
      />

      {/* RECENT ORDERS */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-green-950">Recent Orders</h2>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1 text-sm font-medium text-green-700 hover:underline"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {ordersLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        ) : ordersError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-600">
              We could not load your orders right now.
            </p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-400">No orders yet</p>
            <Link
              href="/products"
              className="mt-2 inline-block text-sm font-medium text-green-700 hover:underline"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const firstItem = order.items[0];
              const label =
                firstItem?.productName ?? firstItem?.bundleName ?? "Order";
              const extra =
                order.items.length > 1
                  ? ` +${order.items.length - 1} more`
                  : "";

              return (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition hover:border-green-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
                      <Package className="h-4 w-4 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {label}
                        {extra}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
