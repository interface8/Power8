"use client";

import { Activity } from "@/types/merchant";
import {
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Clock,
  Layers3,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface RecentActivityProps {
  activities: Activity[];
  onViewAll?: () => void;
}

const activityIcons = {
  approved: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
  rejected: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
  order: { icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
  submitted: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  bundle: { icon: Layers3, color: "text-purple-600", bg: "bg-purple-100" },
};

export function RecentActivity({ activities, onViewAll }: RecentActivityProps) {
  const displayActivities = activities.slice(0, 6);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <p className="text-sm text-gray-500">
            Latest updates on your products and orders
          </p>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {displayActivities.map((activity) => {
          const config =
            activityIcons[activity.type as keyof typeof activityIcons] ||
            activityIcons.submitted;
          const Icon = config.icon;
          return (
            <div
              key={activity.id}
              className="p-4 hover:bg-orange-50/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.bg}`}
                >
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {activity.description}
                  </p>
                  {activity.actionLabel && activity.actionLink && (
                    <Link
                      href={activity.actionLink}
                      className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      {activity.actionLabel}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
