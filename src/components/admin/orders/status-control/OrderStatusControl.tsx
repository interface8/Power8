"use client";

import { Package, ChevronRight, CheckCircle2, Lock } from "lucide-react";

import { OrderStatus } from "@/types/order";

interface OrderStatusControlProps {
  currentStatus: OrderStatus;
  onUpdateStatus: (status: OrderStatus) => void;
  isLoading: boolean;
}

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["CANCELLED"],
  SHIPPED: [],
  DELIVERED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

const statusColors: Record<
  OrderStatus,
  {
    bg: string;
    active: string;
    text: string;
    border: string;
  }
> = {
  PENDING: {
    bg: "bg-yellow-50 hover:bg-yellow-100",
    active: "bg-yellow-500",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },

  CONFIRMED: {
    bg: "bg-blue-50 hover:bg-blue-100",
    active: "bg-blue-500",
    text: "text-blue-700",
    border: "border-blue-200",
  },

  PROCESSING: {
    bg: "bg-purple-50 hover:bg-purple-100",
    active: "bg-purple-500",
    text: "text-purple-700",
    border: "border-purple-200",
  },

  SHIPPED: {
    bg: "bg-indigo-50 hover:bg-indigo-100",
    active: "bg-indigo-500",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },

  DELIVERED: {
    bg: "bg-green-50 hover:bg-green-100",
    active: "bg-green-500",
    text: "text-green-700",
    border: "border-green-200",
  },

  COMPLETED: {
    bg: "bg-emerald-50 hover:bg-emerald-100",
    active: "bg-emerald-500",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },

  CANCELLED: {
    bg: "bg-red-50 hover:bg-red-100",
    active: "bg-red-500",
    text: "text-red-700",
    border: "border-red-200",
  },
};

const timelineSteps: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
];

export function OrderStatusControl({
  currentStatus,
  onUpdateStatus,
  isLoading,
}: OrderStatusControlProps) {
  const availableStatuses = allowedTransitions[currentStatus] || [];

  const isCompletedOrder = currentStatus === "COMPLETED";

  const isCancelledOrder = currentStatus === "CANCELLED";

  const isLocked = availableStatuses.length === 0;

  const currentIndex = timelineSteps.indexOf(currentStatus);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 bg-linear-to-r from-orange-50/50 to-white px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start gap-3 sm:items-center sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-100 sm:h-12 sm:w-12">
            <Package className="h-4 w-4 text-orange-600 sm:h-5 sm:w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              Order Status
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Track and update order progress
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Current Status */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Current Status:
            </span>

            <span
              className={`
                inline-flex items-center rounded-full border px-3 py-1
                text-xs font-semibold
                ${statusColors[currentStatus].bg}
                ${statusColors[currentStatus].text}
                ${statusColors[currentStatus].border}
              `}
            >
              {currentStatus.replace("_", " ")}
            </span>
          </div>

          {isLocked && (
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
              <Lock className="h-3.5 w-3.5" />
              Final State
            </div>
          )}
        </div>

        {/* Available Actions */}
        {availableStatuses.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Available Actions
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {availableStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(status)}
                  disabled={isLoading}
                  className={`
                    inline-flex items-center gap-2 rounded-xl
                    px-4 py-2.5
                    text-xs font-semibold sm:text-sm
                    transition-all duration-200

                    ${statusColors[status].bg}
                    ${statusColors[status].text}

                    hover:shadow-md
                    active:scale-95

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  `}
                >
                  <span>{status.replace("_", " ")}</span>

                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="overflow-x-auto pt-2">
          <div className="flex min-w-150 items-start">
            {timelineSteps.map((step, idx) => {
              const stepIndex = timelineSteps.indexOf(step);

              const isCompleted = stepIndex <= currentIndex;

              const isCurrent = step === currentStatus;

              return (
                <div key={step} className="flex flex-1 items-center">
                  <div className="flex w-full flex-col items-center">
                    {/* Progress line */}
                    <div
                      className={`
                        h-2 w-full rounded-full transition-all duration-300
                        ${isCompleted ? "bg-orange-500" : "bg-gray-200"}
                      `}
                    />

                    {/* Label */}
                    <div
                      className={`
                        mt-3 text-center text-[10px]
                        font-semibold uppercase tracking-wide
                        sm:text-xs

                        ${
                          isCurrent
                            ? "text-orange-600"
                            : isCompleted
                              ? "text-gray-700"
                              : "text-gray-400"
                        }
                      `}
                    >
                      {step}
                    </div>
                  </div>

                  {idx < timelineSteps.length - 1 && <div className="w-1.5" />}
                </div>
              );
            })}
          </div>
        </div>

        {isCompletedOrder && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
            <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-emerald-700 sm:text-base">
                  Order Successfully Completed
                </h3>

                <p className="mt-1 text-xs text-emerald-600 sm:text-sm">
                  This order has reached its final stage and no further actions
                  are required.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cancelled State */}
        {isCancelledOrder && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
            <p className="text-sm font-semibold text-red-700">
              This order has been cancelled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
