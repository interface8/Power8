"use client";

import { Package, CheckCircle2, Clock } from "lucide-react";
import type { MerchantBundleStats as MerchantBundleStatsType } from "@/types/merchant-bundles";

interface MerchantBundleStatsProps {
  stats: MerchantBundleStatsType;
}

export function MerchantBundleStats({ stats }: MerchantBundleStatsProps) {
  const cards = [
    {
      label: "Total Bundles",
      value: stats.totalBundles,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Approved",
      value: stats.approvedBundles,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Pending",
      value: stats.pendingBundles,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300 group-hover:w-full" />
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