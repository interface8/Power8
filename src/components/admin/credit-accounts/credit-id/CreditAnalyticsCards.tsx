"use client";

import {
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  Wallet,
} from "lucide-react";
import { AdminCreditDetail } from "@/types/admin-credit-detail";
import { cn } from "@/components/ui/utils";

interface Props {
  account: AdminCreditDetail;
}

interface AnalyticsCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtext?: string;
  progress?: number;
}

function AnalyticsCard({
  label,
  value,
  icon: Icon,
  color,
  subtext,
  progress,
}: AnalyticsCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className={cn("mt-2 text-2xl font-bold", color)}>{value}</p>
          {subtext && <p className="mt-1 text-xs text-gray-400">{subtext}</p>}
        </div>
        <div
          className={cn(
            "rounded-xl p-2.5 transition-all duration-300 group-hover:scale-110",
            color === "text-green-600" ? "bg-green-100" : "bg-orange-100",
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              color === "text-green-600" ? "text-green-600" : "text-orange-500",
            )}
          />
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreditAnalyticsCards({ account }: Props) {
  const total = account.repayment.totalInstallments;
  const paid = account.repayment.paidInstallments;
  const progress = total > 0 ? (paid / total) * 100 : 0;

  const cards = [
    {
      label: "Next Due Date",
      value: account.repayment.nextDueDate
        ? new Date(account.repayment.nextDueDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "No upcoming",
      icon: CalendarClock,
      color: "text-orange-600",
      subtext: account.repayment.nextDueDate ? "Upcoming payment" : "All paid",
    },
    {
      label: "Paid Installments",
      value: `${account.repayment.paidInstallments} / ${account.repayment.totalInstallments}`,
      icon: CheckCircle2,
      color: "text-green-600",
      subtext: `${progress.toFixed(0)}% completed`,
      progress,
    },
    {
      label: "Remaining",
      value: account.repayment.remainingInstallments,
      icon: Wallet,
      color: "text-blue-600",
      subtext: `${account.repayment.remainingInstallments} payments left`,
    },
    {
      label: "Overdue",
      value: account.repayment.overdueInstallments,
      icon: AlertTriangle,
      color:
        account.repayment.overdueInstallments > 0
          ? "text-red-600"
          : "text-gray-400",
      subtext:
        account.repayment.overdueInstallments > 0
          ? "Requires attention"
          : "All on track",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <AnalyticsCard
          key={card.label}
          label={card.label}
          value={card.value}
          icon={card.icon}
          color={card.color}
          subtext={card.subtext}
          progress={"progress" in card ? card.progress : undefined}
        />
      ))}
    </div>
  );
}
