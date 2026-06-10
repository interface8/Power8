"use client";

import { Wallet, Target, Calendar, AlertCircle } from "lucide-react";
import { AdminCreditDetail } from "@/types/admin-credit-detail";
import { cn } from "@/components/ui/utils";

interface Props {
  account: AdminCreditDetail;
}

const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

interface SummaryCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  warning?: boolean;
}

function SummaryCard({ label, value, icon: Icon, warning }: SummaryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      {/* Gradient Bar */}
      <div className="absolute top-0 left-0 h-1 w-0 bg-linear-to-r from-orange-400 to-orange-500 transition-all duration-300 group-hover:w-full" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          
        </div>
        <div className={cn(
          "rounded-xl p-3 transition-all duration-300 group-hover:scale-110",
          warning ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function CreditSummaryCards({ account }: Props) {
  const percentage =
    account.repayment.totalInstallments > 0
      ? Math.round(
          (account.repayment.paidInstallments /
            account.repayment.totalInstallments) *
            100,
        )
      : 0;

  const cards = [
    {
      label: "Total Amount",
      value: formatter.format(account.totalAmount),
      icon: Wallet,
    },
    {
      label: "Balance Remaining",
      value: formatter.format(account.balanceRemaining),
      icon: AlertCircle,
      warning: account.balanceRemaining > 0,
    },
    {
      label: "Duration",
      value: `${account.durationMonths} months`,
      icon: Calendar,
    },
    {
      label: "Repayment Progress",
      value: `${percentage}%`,
      icon: Target,
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <SummaryCard
          key={card.label}
          label={card.label}
          value={card.value}
          icon={card.icon}
          warning={card.warning}
        />
      ))}
    </div>
  );
}