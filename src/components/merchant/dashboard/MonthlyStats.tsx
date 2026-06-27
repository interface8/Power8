"use client";

import { ShoppingBag, Package, Layers3, TrendingUp } from "lucide-react";
import type { MonthlyStats } from "@/types/merchant";

interface MonthlyStatsProps {
  stats: MonthlyStats;
}

export function MonthlyStats({ stats }: MonthlyStatsProps) {
  const cards = [
    {
      label: "Orders Received",
      value: stats.ordersReceived,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Products Active",
      value: stats.productsActive,
      icon: Package,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Bundles Live",
      value: stats.bundlesLive,
      icon: Layers3,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">This Month</h2>
        </div>
        <p className="text-sm text-gray-500">Performance metrics for the current month</p>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 transition-all hover:border-orange-200 hover:bg-orange-50/20"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}