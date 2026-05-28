"use client";

import { CreditScheduleItem } from "@/types/order";
import { StatusBadge } from "./StatusBadge";

interface PaymentScheduleTableProps {
  schedules: CreditScheduleItem[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function PaymentScheduleTable({ schedules }: PaymentScheduleTableProps) {
  if (schedules.length === 0) return null;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 mb-4 sm:mb-6 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-semibold">Payment Schedule</h2>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden divide-y divide-gray-100">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 text-sm">
                {formatDate(schedule.dueDate)}
              </span>
              <StatusBadge status={schedule.status} size="sm" />
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-900">
                {formatCurrency(schedule.amountDue)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-100">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600">
                Due Date
              </th>
              <th className="text-right px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600">
                Amount
              </th>
              <th className="text-left px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="border-b border-gray-100">
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">
                  {formatDate(schedule.dueDate)}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-right text-sm text-gray-600">
                  {formatCurrency(schedule.amountDue)}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <StatusBadge status={schedule.status} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
