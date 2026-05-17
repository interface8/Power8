"use client";

import {
  DollarSign,
  Users,
  ShoppingCart,
  AlertTriangle,
  Package,
  Boxes,
} from "lucide-react";

import StatCard from "./StatCard";
import { useAdminStats } from "@/hooks/use-admin-stats";
import DashboardStatsSkeleton from "./DashboardStatsSkeleton";
import DashboardErrorState from "./DashboardErrorState";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function DashboardStats() {
  const { data, loading, error, refetch } = useAdminStats();

  if (loading) {
    return <DashboardStatsSkeleton />;
  }

  if (error || !data) {
    return (
      <DashboardErrorState
        message={error || "Failed to load dashboard statistics"}
        onRetry={refetch}
      />
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: currencyFormatter.format(data.totalRevenue),
      icon: DollarSign,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },

    {
      title: "Active Users",
      value: data.activeUsers,
      icon: Users,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },

    {
      title: "Total Orders",
      value: data.totalOrders,
      icon: ShoppingCart,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
    },

    {
      title: "Overdue Payments",
      value: data.overduePaymentSchedules,
      icon: AlertTriangle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      warning: true,
    },

    {
      title: "In Stock Products",
      value: data.inStockProducts,
      icon: Boxes,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },

    {
      title: "Out Of Stock",
      value: data.outOfStockProducts,
      icon: Package,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      warning: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
          iconBg={stat.iconBg}
          warning={stat.warning}
        />
      ))}
    </div>
  );
}
