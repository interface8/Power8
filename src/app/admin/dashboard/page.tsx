"use client";

import DashboardStats from "@/components/admin/dashboard/DashboardStats";
import RecentOrdersTable from "@/components/admin/dashboard/RecentOrdersTable";
import DashboardStatsSkeleton from "@/components/admin/dashboard/DashboardStatsSkeleton";
import { useAdminStats } from "@/hooks/use-admin-stats";
import { useAuth } from "@/components/providers/auth-provider";

export default function DashboardPage() {
  const { data, loading, error, refetch } = useAdminStats();
  const { user } = useAuth();

  if (loading) {
    return <DashboardStatsSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-red-700">
          Failed to load dashboard
        </h2>

        <p className="text-red-500 mt-2 text-sm">{error}</p>

        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 -mt-1">
      {/* Top */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        <p className="text-gray-500 mt-1">
          Welcome back, {user?.name || "Administrator"}. Here&apos;s an overview
          of your store.
        </p>
      </div>

      {/* Stats */}
      <DashboardStats stats={data} />

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900 text-lg">
              Recent Orders
            </h2>

            <button className="text-sm text-orange-500 font-medium">
              View All
            </button>
          </div>

          <RecentOrdersTable orders={data.recentOrders} />
        </div>

        {/* Activities */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 text-lg mb-6">
            Platform Insights
          </h2>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />

              <div>
                <p className="text-sm text-gray-800">
                  {data.totalRegisteredUsers} registered users
                </p>

                <p className="text-xs text-gray-500">Current platform users</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />

              <div>
                <p className="text-sm text-gray-800">
                  {data.products.lowStock} products low in stock
                </p>

                <p className="text-xs text-gray-500">Inventory warning</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />

              <div>
                <p className="text-sm text-gray-800">
                  {data.products.outOfStock} products out of stock
                </p>

                <p className="text-xs text-gray-500">Requires attention</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />

              <div>
                <p className="text-sm text-gray-800">
                  {data.totalOrders} total orders
                </p>

                <p className="text-xs text-gray-500">Platform transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
