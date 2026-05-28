"use client";

import { User2, Wallet, CreditCard, ShieldCheck } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface OrderSummaryProps {
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  paymentType: string;
  paymentStatus: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

interface InfoCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value?: string | React.ReactNode;
  badge?: React.ReactNode;
}

function InfoCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  badge,
}: InfoCardProps) {
  return (
    <div className="group rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-all duration-200 hover:border-orange-100 hover:bg-orange-50/40 hover:shadow-sm">
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} transition-transform group-hover:scale-105`}
      >
        <div className={iconColor}>{icon}</div>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      {badge ? (
        <div className="mt-2">{badge}</div>
      ) : (
        <p className="mt-1 text-base font-semibold text-gray-900 wrap-break-word">
          {value}
        </p>
      )}
    </div>
  );
}

export function OrderSummary({
  customerName,
  customerEmail,
  totalAmount,
  paymentType,
  paymentStatus,
}: OrderSummaryProps) {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 bg-linear-to-r from-orange-50/50 to-white px-5 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            <p className="text-sm text-gray-500">
              Overview of customer and payment details
            </p>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-orange-500 to-orange-600 px-4 py-2.5 min-w-35">
            <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-white/10" />
            <p className="text-xs font-medium text-orange-100">Total Amount</p>
            <p className="text-lg font-bold text-white">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="p-5">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3">
          <InfoCard
            icon={<User2 className="h-4 w-4" />}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
            label="Customer"
            value={
              <div>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {customerName}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {customerEmail}
                </p>
              </div>
            }
          />

          <InfoCard
            icon={<Wallet className="h-4 w-4" />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            label="Total Amount"
            value={formatCurrency(totalAmount)}
          />

          <InfoCard
            icon={<CreditCard className="h-4 w-4" />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            label="Payment Type"
            badge={<StatusBadge status={paymentType} size="sm" />}
          />

          <InfoCard
            icon={<ShieldCheck className="h-4 w-4" />}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            label="Payment Status"
            badge={<StatusBadge status={paymentStatus} size="sm" />}
          />
        </div>
      </div>
    </div>
  );
}
