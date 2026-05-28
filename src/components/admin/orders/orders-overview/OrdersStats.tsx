"use client";

import { ShoppingCart, Truck, CreditCard, Wallet, Clock3 } from "lucide-react";

interface OrdersStatsProps {
  totalOrders: number;
  totalShipped: number;
  totalFullPayment: number;
  totalCreditPayment: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  hoverStyles: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  hoverStyles,
}: StatCardProps) {
  return (
    <div
      className={`
        group rounded-3xl border border-gray-200
        bg-white p-5 shadow-sm
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-lg
        ${hoverStyles}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className="
              text-sm font-medium text-gray-500
              transition-colors duration-300
              group-hover:text-gray-700
            "
          >
            {title}
          </p>

          <h3
            className="
              mt-3 text-3xl font-bold tracking-tight text-gray-900
            "
          >
            {value.toLocaleString()}
          </h3>
        </div>

        <div
          className={`
            flex h-14 w-14 items-center justify-center
            rounded-2xl transition-all duration-300
            group-hover:scale-110
            ${iconBg}
          `}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

export default function OrdersStats({
  totalOrders,
  totalShipped,
  totalFullPayment,
  totalCreditPayment,
}: OrdersStatsProps) {
  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Orders Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Monitor orders and payment activities
          </p>
        </div>

        {/* Last Updated Badge */}
        <div
          className="
            hidden sm:flex items-center gap-2
            rounded-full border border-orange-200
            bg-orange-50 px-4 py-2
            text-xs font-medium text-orange-700
          "
        >
          <Clock3 className="h-3.5 w-3.5" />

          <span>Updated {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        className="
          grid grid-cols-1 gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingCart}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          hoverStyles="
    hover:border-orange-200
    hover:bg-orange-50/40
  "
        />

        <StatCard
          title="Shipping Orders"
          value={totalShipped}
          icon={Truck}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          hoverStyles="
    hover:border-blue-200
    hover:bg-blue-50/40
  "
        />

        <StatCard
          title="Full Payments"
          value={totalFullPayment}
          icon={Wallet}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          hoverStyles="
    hover:border-emerald-200
    hover:bg-emerald-50/40
  "
        />

        <StatCard
          title="Credit Payments"
          value={totalCreditPayment}
          icon={CreditCard}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          hoverStyles="
    hover:border-purple-200
    hover:bg-purple-50/40
  "
        />
      </div>
    </div>
  );
}
