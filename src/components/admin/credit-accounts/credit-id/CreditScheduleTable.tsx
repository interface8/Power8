"use client";

import { Calendar, Wallet, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { AdminCreditSchedule } from "@/types/admin-credit-detail";
import { useState } from "react";

interface Props {
  schedules: AdminCreditSchedule[];
}

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const statusConfig = {
  PAID: { label: "Paid", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  OVERDUE: { label: "Overdue", color: "bg-red-100 text-red-700", icon: AlertCircle },
  PENDING: { label: "Pending", color: "bg-orange-100 text-orange-700", icon: Clock },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

export default function CreditScheduleTable({ schedules }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(schedules.length / itemsPerPage);
  const paginatedSchedules = schedules.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!schedules.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
          <Calendar className="h-8 w-8 text-orange-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No Payment Schedule</h3>
        <p className="mt-2 text-sm text-gray-500">No repayment schedule has been generated yet for this credit account.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-linear-to-r from-orange-50/30 to-white px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
          <Wallet className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Payment Schedule</h2>
          <p className="text-sm text-gray-500">Repayment plan and transaction history</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-150">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Installment</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Due Date</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Amount Due</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSchedules.map((schedule) => (
              <tr
                key={schedule.id}
                className={`border-b border-gray-100 transition-colors hover:bg-orange-50/30 ${
                  schedule.status === "OVERDUE" ? "bg-red-50/30" : ""
                }`}
              >
                <td className="px-6 py-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                    {schedule.installmentNumber}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(schedule.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900">
                  {currencyFormatter.format(schedule.amountDue)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={schedule.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <p className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, schedules.length)} of {schedules.length} installments
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:border-orange-200 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:border-orange-200 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      <div className="border-t border-gray-100 bg-gray-50/30 px-6 py-4">
        <div className="flex flex-wrap justify-between gap-4 text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-gray-500">Paid: {schedules.filter(s => s.status === "PAID").length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <span className="text-gray-500">Pending: {schedules.filter(s => s.status === "PENDING").length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-gray-500">Overdue: {schedules.filter(s => s.status === "OVERDUE").length}</span>
            </div>
          </div>
          <div className="text-gray-500">
            Total Remaining: <span className="font-semibold text-gray-900">
              {currencyFormatter.format(schedules.filter(s => s.status !== "PAID").reduce((sum, s) => sum + s.amountDue, 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}