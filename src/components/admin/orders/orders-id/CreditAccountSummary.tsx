"use client";

import { CreditAccount } from "@/types/order";

interface CreditAccountSummaryProps {
  credit: CreditAccount;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

export function CreditAccountSummary({ credit }: CreditAccountSummaryProps) {
  const monthlyPayment = credit.totalAmount / credit.durationMonths;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 mb-4 sm:mb-6">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-semibold">
          Credit Account Summary
        </h2>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Account ID</p>
            <p className="font-semibold text-sm sm:text-base text-gray-900 break-all">
              {credit.id}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">
              Total Amount
            </p>
            <p className="font-semibold text-sm sm:text-base text-gray-900">
              {formatCurrency(credit.totalAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">
              Balance Remaining
            </p>
            <p className="font-semibold text-sm sm:text-base text-red-600">
              {formatCurrency(credit.balanceRemaining)}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">
              Monthly Payment
            </p>
            <p className="font-semibold text-sm sm:text-base text-gray-900">
              {formatCurrency(monthlyPayment)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
