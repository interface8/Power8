import {
  DollarSign,
  Users,
  ShoppingCart,
  AlertTriangle,
  Package,
  Boxes,
  CreditCard,
} from "lucide-react";
import { AdminStats } from "@/types/admin";
import StatCard from "./StatCard";
import { calculateTrend } from "@/utils/calculateTrend";

interface DashboardStatsProps {
  stats: AdminStats;
}

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const revenueTrend = calculateTrend(
    stats.totalRevenue,
    stats.previousMonthRevenue,
  );

  const usersTrend = calculateTrend(
    stats.totalRegisteredUsers,
    stats.previousMonthUsers,
  );

  const ordersTrend = calculateTrend(
    stats.totalOrders,
    stats.previousMonthTotalOrder,
  );

  const creditsTrend = calculateTrend(
    stats.activeCreditAccounts,
    stats.previousMonthActiveCredits,
  );

  const overdueTrend = calculateTrend(
    stats.overduePaymentSchedules,
    stats.previousMonthOverduePayment,
  );

  const inStockTrend = calculateTrend(
    stats.products.inStock,
    stats.previousMonthInStock,
  );

  const outOfStockTrend = calculateTrend(
    stats.products.outOfStock,
    stats.previousMonthOutOfStock,
  );

  const lowStockTrend = calculateTrend(
    stats.products.lowStock,
    stats.previousMonthLowStock,
  );

  const cards = [
    {
      title: "Total Revenue",
      value: currencyFormatter.format(stats.totalRevenue),
      icon: DollarSign,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      trend: revenueTrend.percentage,
      trendPositive: revenueTrend.positive,
    },

    {
      title: "Registered Users",
      value: stats.totalRegisteredUsers,
      icon: Users,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      trend: usersTrend.percentage,
      trendPositive: usersTrend.positive,
    },

    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
      trend: ordersTrend.percentage,
      trendPositive: ordersTrend.positive,
    },

    {
      title: "Active Credits",
      value: stats.activeCreditAccounts,
      icon: CreditCard,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      trend: creditsTrend.percentage,
      trendPositive: creditsTrend.positive,
    },

    {
      title: "Overdue Payments",
      value: stats.overduePaymentSchedules,
      icon: AlertTriangle,
      iconColor:
        stats.overduePaymentSchedules > 0 ? "text-red-600" : "text-green-600",
      iconBg: stats.overduePaymentSchedules > 0 ? "bg-red-100" : "bg-green-100",
      warning: stats.overduePaymentSchedules > 0,
      trend: overdueTrend.percentage,
      trendPositive: overdueTrend.positive,
    },

    {
      title: "In Stock",
      value: stats.products.inStock,
      icon: Boxes,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      trend: inStockTrend.percentage,
      trendPositive: inStockTrend.positive,
    },

    {
      title: "Out Of Stock",
      value: stats.products.outOfStock,
      icon: Package,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      warning: stats.products.outOfStock > 0,
      trend: outOfStockTrend.percentage,
      trendPositive: outOfStockTrend.positive,
    },

    {
      title: "Low Stock",
      value: stats.products.lowStock,
      icon: Package,
      iconColor:
        stats.products.lowStock > 0 ? "text-yellow-600" : "text-green-600",
      iconBg: stats.products.lowStock > 0 ? "bg-yellow-100" : "bg-green-100",
      warning: stats.products.lowStock > 0,
      trend: lowStockTrend.percentage,
      trendPositive: lowStockTrend.positive,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          iconColor={card.iconColor}
          iconBg={card.iconBg}
          warning={card.warning}
          trend={card.trend}
          trendPositive={card.trendPositive}
        />
      ))}
    </div>
  );
}
