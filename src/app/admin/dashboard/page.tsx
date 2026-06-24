"use client";

import DashboardStats from "@/components/admin/dashboard/DashboardStats";
import RecentOrdersTable from "@/components/admin/dashboard/RecentOrdersTable";
import DashboardStatsSkeleton from "@/components/admin/dashboard/DashboardStatsSkeleton";
import { useAdminStats } from "@/hooks/use-admin-stats";
import { useAuth } from "@/components/providers/auth-provider";
import { ArrowUpRight } from "lucide-react";
import { ErrorState } from "@/components/ui/states";

export default function DashboardPage() {
  const { data, loading, error, refetch } = useAdminStats();
  const { user } = useAuth();

  if (loading) {
    return <DashboardStatsSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="space-y-8">
        <ErrorState
          error={error || "Failed to load dashboard data"}
          onRetry={refetch}
        />
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500 md:text-base">
            Welcome back, {user?.name || "Administrator"}. Here’s a real-time
            overview of your store performance, customer activities, and
            inventory insights.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
            <ArrowUpRight className="h-5 w-5 text-orange-600" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Growth
            </p>

            <h3 className="text-lg font-bold text-gray-900">
              +18.4% this month
            </h3>
          </div>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats stats={data} />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
        {/* Orders */}
        <div className="2xl:col-span-8">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Orders
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Latest customer purchases across the platform
                </p>
              </div>

              <button className="rounded-xl bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-100">
                View All
              </button>
            </div>

            <div className="p-2 sm:p-4">
              <RecentOrdersTable orders={data.recentOrders} />
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="2xl:col-span-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-7">
              <h2 className="text-xl font-bold text-gray-900">
                Platform Insights
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Key operational metrics and alerts
              </p>
            </div>

            <div className="space-y-5">
              {[
                {
                  color: "bg-green-500",
                  title: `${data.totalRegisteredUsers} registered users`,
                  subtitle: "Current active platform users",
                },
                {
                  color: "bg-orange-500",
                  title: `${data.products.lowStock} low stock products`,
                  subtitle: "Inventory level warning",
                },
                {
                  color: "bg-red-500",
                  title: `${data.products.outOfStock} out of stock`,
                  subtitle: "Products requiring attention",
                },
                {
                  color: "bg-blue-500",
                  title: `${data.totalOrders} total orders`,
                  subtitle: "Processed transactions",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-2xl border border-gray-100 p-4 transition hover:bg-gray-50"
                >
                  <div className={`mt-1 h-3 w-3 rounded-full ${item.color}`} />

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
