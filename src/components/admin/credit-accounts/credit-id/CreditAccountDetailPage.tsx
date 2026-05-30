"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CreditAccountDetail } from "@/types/credit-account-detail";

import CreditSummaryCards from "./CreditSummaryCards";
import CreditAccountInfo from "./CreditAccountInfo";
import PaymentScheduleTable from "./PaymentScheduleTable";
import RepaymentProgressCard from "./RepaymentProgressCard";

interface Props {
  account: CreditAccountDetail;
}

export default function CreditAccountDetailPage({
  account,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/admin/credit-accounts"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft size={18} />
        Back to Credit Accounts
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {account.customerName}
            </h1>

            <div className="mt-2 flex flex-col gap-1 text-sm text-gray-500 md:flex-row md:gap-6">
              <span>{account.email}</span>
              <span>{account.phone}</span>
            </div>
          </div>

          <div>
            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                account.creditStatus === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : account.creditStatus === "COMPLETED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {account.creditStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <CreditSummaryCards
        totalAmount={account.totalAmount}
        balanceRemaining={account.balanceRemaining}
        creditStatus={account.creditStatus}
      />

      {/* Repayment Progress */}
      <RepaymentProgressCard
        percentage={account.repaymentPercentage}
      />

      {/* Customer Information */}
      <CreditAccountInfo
        customerName={account.customerName}
        email={account.email}
        phone={account.phone}
        durationMonths={account.durationMonths}
        startDate={account.startDate}
        endDate={account.endDate}
      />

      {/* Payment Schedule */}
      <PaymentScheduleTable
        payments={account.paymentSchedule}
      />
    </div>
  );
}