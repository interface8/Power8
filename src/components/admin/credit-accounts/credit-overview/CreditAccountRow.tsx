"use client";

import Link from "next/link";

import {
  CreditAccount,
} from "@/types/credit-account";

import CreditStatusBadge from "./CreditStatusBadge";
import RepaymentProgress from "./RepaymentProgress";

interface Props {
  account: CreditAccount;
}

const currencyFormatter = new Intl.NumberFormat(
  "en-GH",
  {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }
);

export default function CreditAccountRow({
  account,
}: Props) {
  return (
    <Link
      href={`/admin/credit-accounts/${account.id}`}
      className="grid min-w-237.5 grid-cols-6 items-center gap-4 border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50"
    >
      <div className="font-semibold text-gray-900">
        {account.customerName}
      </div>

      <div className="text-gray-600">
        {currencyFormatter.format(account.totalAmount)}
      </div>

      <div className="text-gray-600">
        {currencyFormatter.format(
          account.balanceRemaining
        )}
      </div>

      <div className="text-gray-600">
        {account.durationMonths} months
      </div>

      <div>
        <CreditStatusBadge
          status={account.status}
        />
      </div>

      <RepaymentProgress
        percentage={
          account.repaymentPercentage
        }
        status={account.status}
      />
    </Link>
  );
}