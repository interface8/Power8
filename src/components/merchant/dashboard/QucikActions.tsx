"use client";

import { Plus, Layers, Clock, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

interface QuickAction {
  label: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bg: string;
}

const quickActions: QuickAction[] = [
  {
    label: "Add new product",
    icon: Plus,
    href: "/merchant/products/new",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    label: "Create a bundle",
    icon: Layers,
    href: "/merchant/bundles/new",
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    label: "View pending products",
    icon: Clock,
    href: "/merchant/products/pending",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
  {
    label: "View all orders",
    icon: ShoppingBag,
    href: "/merchant/orders",
    color: "text-green-600",
    bg: "bg-green-100",
  },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <p className="text-sm text-gray-500">Common tasks and shortcuts</p>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 transition-all hover:border-orange-200 hover:bg-orange-50/40 hover:shadow-sm group"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.bg}`}>
                <Icon className={`h-4 w-4 ${action.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{action.label}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}