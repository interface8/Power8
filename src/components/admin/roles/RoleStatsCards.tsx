"use client";

import { Shield, Key, Users, BadgeCheck } from "lucide-react";
import { RoleStats } from "@/types/admin-role";

interface RoleStatsCardsProps {
  stats: RoleStats;
}

export function RoleStatsCards({ stats }: RoleStatsCardsProps) {
  const cards = [
    { label: "Total Roles", value: stats.totalRoles, icon: Shield, color: "text-orange-500", bg: "bg-orange-100" },
    { label: "Total Permissions", value: stats.totalPermissions, icon: Key, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-green-500", bg: "bg-green-100" },
    { label: "Roles with Users", value: stats.totalRolesWithUsers, icon: BadgeCheck, color: "text-purple-500", bg: "bg-purple-100" },
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="absolute top-0 left-0 h-1 w-0 bg-linear-to-r from-orange-400 to-orange-500 transition-all duration-300 group-hover:w-full" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
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