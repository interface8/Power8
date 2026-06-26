"use client";

import { dummyMerchantStats, dummyActivities, dummyMonthlyStats } from "@/data/merchant-data";
import { MerchantStatsCards } from "@/components/merchant/dashboard/MerchantStatsCards";
import { RecentActivity } from "@/components/merchant/dashboard/RecentActivity";
import { QuickActions } from "@/components/merchant/dashboard/QucikActions";
import { MonthlyStats } from "@/components/merchant/dashboard/MonthlyStats";
import { useRouter } from "next/navigation";

export default function MerchantDashboardPage() {
  const router = useRouter();

  const handleViewAllActivity = () => {
    router.push("/merchant/activity");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here&apos;s an overview of your store</p>
      </div>

      {/* Stats Cards */}
      <MerchantStatsCards stats={dummyMerchantStats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2/3 of the space */}
        <div className="lg:col-span-2">
          <RecentActivity activities={dummyActivities} onViewAll={handleViewAllActivity} />
        </div>

        {/* Quick Actions - Takes 1/3 of the space */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Monthly Stats */}
      <MonthlyStats stats={dummyMonthlyStats} />
    </div>
  );
}