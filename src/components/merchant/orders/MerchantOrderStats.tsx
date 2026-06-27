"use client";

import { ShoppingBag, Clock, Package, CheckCircle2 } from "lucide-react";
import type { MerchantOrderStats as MerchantOrderStatsType } from "@/types/merchant-order";

interface MerchantOrderStatsProps {
  stats: MerchantOrderStatsType;
}

export function MerchantOrderStats({ stats }: MerchantOrderStatsProps) {
  const cards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Pending",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      label: "Processing",
      value: stats.processingOrders,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Completed",
      value: stats.completedOrders,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="absolute top-0 left-0 h-1 w-0 bg-linear-to-r from-orange-400 to-orange-500 transition-all duration-300 group-hover:w-full" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`rounded-xl p-3 ${card.bg} transition-transform group-hover:scale-110`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}