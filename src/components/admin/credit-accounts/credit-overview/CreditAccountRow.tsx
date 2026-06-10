"use client";

import Link from "next/link";

import { AdminCreditAccount } from "@/types/admin-credit";

import CreditStatusBadge from "./CreditStatusBadge";
import RepaymentProgress from "./RepaymentProgress";

interface Props {
  account: AdminCreditAccount;
}

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function CreditAccountRow({ account }: Props) {
  const repaymentPercentage =
    account.repayment.totalInstallments > 0
      ? Math.round(
          (account.repayment.paidInstallments /
            account.repayment.totalInstallments) *
            100,
        )
      : 0;

  return (
    <Link
      href={`/admin/credit-accounts/${account.id}`}
      className="grid min-w-237.5 grid-cols-6 items-center gap-4 border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50"
    >
      <div>
        <p className="font-semibold text-gray-900">{account.customer.name}</p>

        <p className="text-xs text-gray-500">{account.customer.email}</p>
      </div>

      <div className="text-gray-600">
        {currencyFormatter.format(account.totalAmount)}
      </div>

      <div className="text-gray-600">
        {currencyFormatter.format(account.balanceRemaining)}
      </div>

      <div className="text-gray-600">{account.durationMonths} months</div>

      <div>
        <CreditStatusBadge status={account.status} />
      </div>

      <RepaymentProgress
        percentage={repaymentPercentage}
        status={account.status}
      />
    </Link>
  );
}
